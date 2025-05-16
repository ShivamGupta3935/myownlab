import express from "express"
import { login, logout, profile, register } from "../controller/auth.controller.js";
import {isLoggedIn} from '../middleware/auth.middleware.js'

const authRouter = express.Router()
authRouter.post('/register', register)

authRouter.route('/login').post(login)
authRouter.route('/logout').get(isLoggedIn, logout)
authRouter.route('/me').get(isLoggedIn, profile)

export default authRouter;