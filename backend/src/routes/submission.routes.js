import express from 'express'
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from '../controller/submission.controller.js';

const submissionRouter = express.Router()

submissionRouter.route('/all-submission').get(isLoggedIn, getAllSubmission)
submissionRouter.route('/get-submission/:problemId').get(isLoggedIn,getSubmissionsForProblem )
submissionRouter.route('/get-submissions-count/:problemId').get(isLoggedIn, getAllTheSubmissionsForProblem )


export default submissionRouter;