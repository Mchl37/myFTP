import { createServer } from "net"
import path from "path"
import process from "process"
import fs from "fs"

const accounts = require("../data/users.json")

export function Launch(port) {
    
    const server = createServer((socket) => {
        console.log("📡 New connection")
        let userstatut = false
        let statut = false
        let id = "-1"
        let defaultpath = process.cwd()
        let defaultfolder = path.basename(process.cwd())
        
        socket.on("data", (data) => {
            const message = data.toString()
            const [command, ...args] = message.trim().split(" ")
            console.log(command, args)
            let datafile = data.toString()

            switch(command) {
                case "USER":
                case "user":
                    if (userstatut == true) {
                        socket.write("❗️ You are already logged. If you want to login with another account, you have to use the QUIT command.")
                    } else {
                        for (let i = 0; i < accounts.users.length; i++)
                            if (args == accounts.users[i].name) {
                                userstatut = true
                                id = i
                                i = accounts.users.length
                                console.log("331 : User name okay, need password")
                                socket.write("✅ Successful user identification ! Use the PASS command to enter the password.")
                            } else if (accounts.users[i].name != args) {
                                console.log("Scanning database ...")
                            } else {
                                i = accounts.users.length
                                console.log("430 : Invalid username or password")
                                socket.write("❌ Username does not exist, try again.")
                            }
                        if (id == "-1") {
                            socket.write("❗️ The user is not in the database.")
                        }
                    }
                    break

                case "PASS":
                case "pass":
                    if (userstatut == false) {
                        console.log("332 : Need account for login")
                        socket.write("❗️ You must first authenticate yourself with the command USER.")
                    } else {
                        if (args == accounts.users[id].password) {
                            statut = true
                            console.log("230 : User logged in, proceed")
                            socket.write("✅ Successful identification ! You can now use the following command : LIST, PWD, CWD, RETR, STOR.")
                        } else {
                            console.log("430 : Invalid username or password")
                            socket.write("❌ Wrong password, try again.")
                        }
                    }
                    break

                case "PWD":
                case "pwd":
                    if (statut == true) {
                        socket.write(process.cwd())
                    } else {
                        console.log("332 : Need account for login")
                        socket.write("❗️ You must first authenticate yourself with the command USER.")
                    }
                    break

                case "CWD":
                case "cwd":
                    if (statut == true) {
                        process.chdir(args)
                        newpath = process.cwd().split(path.sep)
                        pathid = newpath.indexOf(defaultfolder).toString()
                        if (pathid == "-1") {
                            socket.write("✅ You are unable to access !")
                            process.chdir(defaultpath)
                        } else if (pathid != "-1") {
                            socket.write("❌ You are not unable to access !")
                        }
                    } else {
                        console.log("332 : Need account for login")
                        socket.write("❗️ You must first authenticate yourself with the command USER.")
                    }
                    break

                case "LIST":
                case "list":
                    if (statut == true) {
                        fs.readdir(process.cwd(), (err, files) => {
                            if (err) {
                                console.log("error")
                            } else if (files.length == 0) {
                                socket.write("❗️ No such file or directory.")
                            } else {
                                console.log("10066 : Directory not empty")
                                socket.write(files.join("   "))
                            }
                        })
                    } else {
                        console.log("332 : Need account for login")
                        socket.write("❗️ You must first authenticate yourself with the command USER.")
                    }
                    break

                case "STOR":
                case "stor":
                    if (statut == true) {
                        fs.writeFile(args, datafile, (err) => {
                            if (err) {
                                console.log("error")
                            } else {
                                socket.write("✅ File transferred !")
                            }
                        })
                    } else {
                        console.log("332 : Need account for login")
                        socket.write("❗️ You must first authenticate yourself with the command USER.")
                    }
                    break

                case "RETR":
                case "retr":
                    if (statut == true) {
                        fs.writeFile(args, datafile, (err) => {
                            if (err) {
                                console.log("error")
                            } else {
                                socket.write("✅ File transferred !")
                            }
                        })
                    } else {
                        console.log("332 : Need account for login")
                        socket.write("❗️ You must first authenticate yourself with the command USER.")
                    }
                    break

                case "HELP":
                    case "help":
                    console.log("214 : Help message. On how to use the server or the meaning of a particular non-standard command. This reply is useful only to the human user.")
                    socket.write("\r\n USER <username>: check if the user exist \n PASS <password>: authenticate the user with a password \n LIST: list the current directory of the server \n CWD <directory>: change the current directory of the server \n RETR <filename>: transfer a copy of the file FILE from the server to the client \n STOR <filename>: transfer a copy of the file FILE from the client to the server \n PWD: display the name of the current directory of the server \n HELP: send helpful information to the client \n QUIT: close the connection and stop the program")
                    break
                    
                case "QUIT":
                case "quit":
                    console.log(`221 : Service closing control connection for id : ${id}`)
                    break

                default:
                    console.log("202 : Command not implemented, superfluous at this site")
                    socket.write(`❌ Command "${command}" doesn't exist.`)
                    break
            }
        })
        console.log("220 : Service ready for new user")
        socket.write("Hello 👋 \r\n")
    })

    server.listen(port, () => {
        console.log(`🚀 Server started at localhost:${port}`)
    })
}