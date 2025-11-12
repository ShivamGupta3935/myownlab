import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllSubmission = asyncHandler(async(req, res) => {
    try {
        const userId = req.user.userId

        const submission = await db.submission.findMany({
            where: {
                userId: userId
            }
        })

        return res.status.json(
            new ApiResponse(200, data={submission}, "all submission fetched successfully")
        )

    } catch (error) {
        console.log("error in fetching get all submission", error);        
    }
})

const getSubmissionsForProblem  = asyncHandler(async(req, res) => {
    const {problemId} = req.params
    if (!problemId) {
        throw new ApiError(400, "problem id is mising")
    }

    const allSubmissions = await db.submission.findMany({
        where: {
            userId: req.user.id,
            problemId: problemId
        }
    })
    if (!allSubmissions.length) {
        throw new ApiError(400, "all submission error")
    }

    return res.status(200).json(
        new ApiResponse(200, {allSubmissions}, "all submission fetched successfully")
    )
})

const getAllTheSubmissionsForProblem = asyncHandler(async(req, res) => {
    const {problemId} = req.params.id
    if (!problemId) {
        throw new ApiError(400, "problem id issue")
    }
    const submissionCount = await db.submission.count({
        where: {
            problemId: problemId
        }
    })

    return res.status(200).json(
        new ApiResponse(200, {submissionCount}, "submission count fetched successfully")
    )
})

export {
    getAllSubmission,
    getSubmissionsForProblem ,
    getAllTheSubmissionsForProblem
}
