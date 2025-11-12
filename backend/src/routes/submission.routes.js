import express from 'express'
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from '../controller/submission.controller.js';

const submissionRouter = express.Router()

submissionRouter.route('/all-submission').post(isLoggedIn, getAllSubmission)
submissionRouter.route('/submissions-problem').post(isLoggedIn,getSubmissionsForProblem )
submissionRouter.route('/all-submission-problem').post(isLoggedIn, getSubmissionsForProblem )


export default submissionRouter;