import dotenv from "dotenv"
import express from "express"
import cookieParser from 'cookie-parser'
import authRouter from "./routes/auth.routes.js"
import problemRouter from './routes/problem.route.js'
import executeRouter from './routes/executeCode.router.js'
import submissionRouter from './routes/submission.routes.js'
import playlistRouter from './routes/playlist.route.js'
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
dotenv.config({ path: '../.env' })



const PORT= process.env.PORT || 8181


//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/problem', problemRouter)
app.use('/api/v1/execute-code', executeRouter)
app.use('/api/v1/submissions', submissionRouter)
app.use('/api/v1/playlists', playlistRouter)

app.get("/", (req, res) => {
   res.send("Hello World!");
 });

app.listen(PORT, ()=>{
  console.log(`app is listening ${PORT}`);  
})

