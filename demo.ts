const db = await Deno.openKv()

// Ejemplo añadir un valor
// const user = 'Maruan'
// const result = await db.set(["username"], user)
// console.log(result.ok && 'Creado correctamente')
// const username = await db.get(["username"])
// console.log(username)

// Ejemplo de contador
// const { value } = await db.get<number>(["count"])
// const newValue = value !== null ? value + 1 : 0
// await db.set(["count"], newValue)
// console.log(value)


// Ejemplo de contador de visitas con operación atómica
// await db.set(["visits"], new Deno.KvU64(0n))
// una operación atómica sirve para asegurarnos del orden en el que ocurre las operaciones
// await db.atomic().sum(["visits"], 1n).commit()
// const { value } = await db.get<Deno.KvU64>(["visits"])
// console.log(value)


// Ejemplo guardar objetos
// const car1 = {
//     color: "green",
//     model: "Peugeot" 
// }
// const car2 = {
//     color: "red",
//     model: "Citroen" 
// }

// await db.set(["car", "peugeot"], car1)
// await db.set(["car", "citroen"], car2)

// const result1 = await db.get(["car", "peugeot"])
// const result2 = await db.get(["car", "citroen"])

// con getMany podemos obtener varios valores a la vez, sin consumir más peticiones
// const [result1, result2] = await db.getMany([["car", "peugeot"], ["car", "citroen"]])

// console.log(result1)
// console.log(result2)

const entries = await db.list({prefix: ["car"]})

for await (const entry of entries) {
    console.log(entry)
}

await db.delete(["car", "citroen"])