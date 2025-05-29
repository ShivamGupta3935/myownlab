import { getJudge0LanguageId } from '../libs/judge0.lib.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { submitBatch } from '../libs/judge0.lib.js'
import { pollBatchResults } from '../libs/judge0.lib.js'
import { db } from '../libs/db.js'

const createProblem = asyncHandler(async(req, res) => {
    const {title, description, difficulty,tags,examples,constraints,hint, editorial, referenceSolutions, codeSnippets, testcases} = req.body

    //user role
    if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'only admin create problem')
    }

    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language)
            // console.log("language id : ", languageId);
            
            if (!languageId) {
                return res.status(400).json(new ApiError(400, `${language} is not supported`))
            }
           
            const submissions = testcases.map(({input, output}) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }))

            // console.log( "submission:", submissions);
            
     

        const submissionResults = await submitBatch(submissions)
        console.log( "sum res: ", submissionResults);
        

        const tokens = submissionResults.map(res => res.token)
        console.log( "token:");
        

        const results = await pollBatchResults(tokens)

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            console.log("result______", result);      

            if (result.status.id !== 3) {                
                return res.status(400).json(new ApiError(400, `testcase ${ i + 1} failed for language ${language}`))
            }
        }

    }
    
    const createdProblem = await db.Problem.create({
       data:{ 
        title,
        description,
        tags,
        examples,
        constraints,
        hint,
        editorial,
        referenceSolutions,
        difficulty,
        codeSnippets,
        testcases,
        userId: req.user.id}
    })

    if (!createdProblem) {
        throw new ApiError(404, "problem created failed")
    }


    console.log("created problem -------- ",createdProblem);
    

    

    return res.status(201).json(new ApiResponse(201, {}, "problem created"))
    } catch (error) {
        console.log( "error: ", error);        
        throw new ApiError(400, "error in creating problem")
    }
})
const getAllProblem = asyncHandler(async(req, res) => {
     const problems = await db.Problem.findMany()
     if (!problems) {
        throw new ApiError(404, "problems fetching failed")
     }
     return res.status(200).json(new ApiResponse(
        200,
        problems,
        "problems fetched successfully"
     ))
})
const getProblemById = asyncHandler(async(req, res) => {
    //get id from params
    //validate id
    //using id find problem
    //if not of problem send error 
    // if problem find send res
     const {id} = req.params
     if (!id) {
        throw new ApiError(400, "id not available")
     }

     const problem = await db.problem.findUnique({
        where:{id}
     })
     if (!problem) {
        throw new ApiError(404, "problem does not exist")
     }

     return res.status(200).json(new ApiResponse(
        200,
        problem,
        "problem fetched successfully by id"
     ))
})
const deleteProblem = asyncHandler(async(req, res) => {
     const {id} = req.params
     const existProblem = await db.problem.findUnique({
        where: {
            id
        }
     })
     console.log("del pro" ,existProblem);
     
     if (!existProblem) {
        throw new ApiError(404, "problem not exist")
     }

     await db.problem.delete({
        where: {id}
     })

     return res.status(200).json(new ApiResponse(200,
        {},
        "problem deleted successfully"
     ))


})
const updateProblem = asyncHandler(async(req, res) => {
     
})
const solvedProblem = asyncHandler(async(req, res) => {
     
})

export {
    createProblem,
    getAllProblem,
    getProblemById,
    deleteProblem,
    updateProblem,
    solvedProblem
}