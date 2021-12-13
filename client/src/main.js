import { createConnection } from "net"
import fs from "fs"
import readline from "readline"
import process from "process"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const client = createConnection({port: 4242}, () => {
    console.log("✅ Client connected ! \r\n")
})

client.on("data", (data) => {
    const message = data.toString()
    console.log("Message received : ", message)

    rl.question("Enter your command > ", (answer) => {
        let args = answer.split(" ")
        
        switch (args[0]) {
            case "STOR":
            case "stor":
                let data = fs.readFileSync(args[1], { encoding: "utf8", flag: "r" })
                let myArray = [args[0], args[1], data]
                client.write(myArray.join(" "))
                break

            case "RETR":
            case "retr":

                break
                
            case "QUIT":
            case "quit":
                rl.close();
                client.write(`${answer}`)
                console.log("🔌 You will be disconnected.")
                client.destroy()
                process.exit()
  
            default:
                client.write(`${answer}`)
                break
        }
    })
})