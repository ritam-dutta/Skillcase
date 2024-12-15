import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app=express()

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

export {app}