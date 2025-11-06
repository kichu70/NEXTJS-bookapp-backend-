import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import http from "http"
import cors from 'cors'
import connect from './connection/connectDB.js'
import UserRouter from './routes/userRoute.js'
import BooksRouter from './routes/booksRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import AdminRouter from './routes/adminRoute.js'
import path from 'path'

const app = express()
const server = http.createServer(app)
app.use(express.json())
app.use(cors())


connect;

app.use("/uploads",express.static(path.join(process.cwd(),"uploads")))
app.use('/user',UserRouter)
app.use("/Books",BooksRouter)
app.use("/payment",paymentRouter);
app.use("/admin",AdminRouter);
const PORT = process.env.PORT

server.listen(PORT,()=>{
    console.log("server running")
    console.log(`http://localhost:${PORT}`)
})
