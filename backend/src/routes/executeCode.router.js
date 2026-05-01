import express from 'express'
import { isLoggedIn } from '../middleware/auth.middleware.js'
import { executeCode } from '../controller/executeCode.controller.js'

const executeRouter = express.Router()

executeRouter.post("/execute-code", isLoggedIn, executeCode)

export default executeRouter