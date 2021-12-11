import { createConnection } from "net"
import fs from "fs"
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = createConnection({port: 4242}, () => {
    console.log("✅ Client connected ! \r\n")
})

client.on("data", (data) => {
    const message = data.toString()
    console.log("Message received : ", message)

    rl.question('FTP >> ', (answer) => {
        let args = answer.split(' ')
        
        switch (args[0]) {
            case 'QUIT':
                rl.close();
                client.write(`${answer}`)
                console.log('You will be disconnected.')
                client.destroy()
                // executer ficher bach pour rediriger vers terminal
                break
  
            case 'STOR':
                let data = fs.readFileSync(args[1], { encoding: 'utf8', flag: 'r' })
                let myArray = [args[0], args[1], data]
                client.write(myArray.join(' '))
                break
  
            default:
                client.write(`${answer}`)
                break
        }
    })
})