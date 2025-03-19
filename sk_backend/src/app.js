import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {Server} from "socket.io"
import http from "http"


const app=express()
const server=http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
})

server.listen(process.env.WS_PORT, () => {
    console.log(`WS_Server is running on port ${process.env.WS_PORT}`)
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import freelancerRouter from  "./routes/freelancer.routes.js"
app.use("/api/v1/freelancer", freelancerRouter)

import clientRouter from  "./routes/client.routes.js"
app.use("/api/v1/client", clientRouter)

import projectRouter from "./routes/project.routes.js"
app.use("/api/v1/root", projectRouter)

import { notifications } from "./sockets/notifications.socket.js"
notifications();

export {app, io}