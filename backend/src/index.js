import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
dotenv.config()

const app = express()
app.use(express.json())

app.use('/', (req, res) => {
    console.log("welcome to leetlab 🎉");
    
})

//routes
app.use('/api/v1/auth', authRouter)

app.listen(process.env.PORT, () => {
    console.log("app is listening on port 8020");    
})