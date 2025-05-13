import express, { Router } from "express"
import { login, logout, profile, register } from "../controller/auth.controller.js";

const authRouter = Router()
authRouter.route('/register').post(register)
authRouter.route('/login').post(login)
authRouter.route('/logout').post(logout)
authRouter.route('/me').post(profile)

export default authRouter;