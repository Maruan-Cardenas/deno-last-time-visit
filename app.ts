import { streamSSE } from "https://deno.land/x/hono@v3.11.8/helper/streaming/index.ts"
import { serveStatic } from "https://deno.land/x/hono@v3.11.8/middleware.ts"
import { Hono } from "https://deno.land/x/hono@v3.11.8/mod.ts"

const db = await Deno.openKv()

const app = new Hono()
let i = 0

app.get('/', serveStatic({path: './index.html'}))

app.post('/visit', async (c) => {
    const {city, country, cp, flag} = await c.req.json()
    await db
        .atomic()
        .set(['lastVisit'], {city, country, cp, flag})
        .sum(['visits'], 1n)
        .commit()
    return c.json({ message: 'ok' })
})

app.get('/visit', (c) => {
    return streamSSE(c, async (stream) => {
        const watcher = await db.watch([['lastVisit']])
        for await (const entry of watcher) {
            const { value } = entry[0]
            if (value !== null) {
                await stream.writeSSE({ data: JSON.stringify(value), event: 'update', id: String(i++) })
            }
        }
    })
})

// app.get('/counter', (c) => {
//     return streamSSE(c, async (stream) => {
//         const watcher = await db.watch([['visits']])
//         for await (const entry of watcher) {
//             const { value } = entry[0]
//             if (value !== null) {
//                 await stream.writeSSE({ data: Number(value).toString(), event: 'update', id: String(i++) })
//             }
//         }
//         // while (true) {
//         //     const { value } = await db.get(['visits'])
//         //     // const message = `Son las ${new Date().toLocaleTimeString()}`
//         //     await stream.writeSSE({ data: Number(value).toString(), event: 'update', id: String(i++) })
//         //     await stream.sleep(2000)
//         // }
//     })
// })

Deno.serve(app.fetch)