import express from 'express'
import { createProblem, deleteProblem, getAllProblem, getProblemById, solvedProblem, updateProblem } from '../controller/problem.controller.js'
import { checkAdmin, isLoggedIn } from '../middleware/auth.middleware.js'

const problemRouter = express.Router()

problemRouter.route('/create-problem').post(isLoggedIn, checkAdmin,createProblem)
problemRouter.route('/get-all-problem').post(isLoggedIn, getAllProblem)
problemRouter.route('/get-problem/:id').post(isLoggedIn, getProblemById)
problemRouter.route('delete-problem/:id').delete(isLoggedIn, checkAdmin, deleteProblem)
problemRouter.route('/update-problem/:id').put(isLoggedIn, checkAdmin, updateProblem)
problemRouter.route('/solved-problem').post(isLoggedIn, solvedProblem)

export default problemRouter;