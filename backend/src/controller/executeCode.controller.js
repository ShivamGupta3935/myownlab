import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {getJudge0LanguageId, pollBatchResults, submitBatch} from '../libs/judge0.lib.js'

const executeCode = asyncHandler(async(req, res) => {
   const {source_code, languageId, stdin, expected_outputs, problemId} = req.body
   const userId = req.user?.id

   try {
      if (!Array.isArray(stdin) || !Array.isArray(expected_outputs) || stdin.length !== 0 || stdin.length !== expected_outputs.length) {
         throw new ApiError(400, "invalid data")
      }

      const submissions = stdin.map((input) => ({
         source_code,
         languageId,
         stdin: input
      }))

      const submitResponse = await submitBatch(submissions)

      const tokens = submitResponse.map(res => res.token)
       
      const results = await pollBatchResults(tokens)

      console.log('result_-------------------');
      console.log(results);

      let allPassed = true
      const detailedResults = results.map((result, idx) => {
         const stdout = result.stdout?.trim()
         const expected_output = expected_outputs[i]?.trim()
         const passed = stdout === expected_output

         if (!passed) allPassed = false
         
         return {
            testCase: i+1,
            passed,
            expected: expected_output,
            stderr: result.stderr || null,
            compileOutput: result.compileOutput || null,
            status: result.status.description,
            memory: result.memory? `${result.memory}KB`: undefined,
            time: result.time? `${result.time}s`: undefined
         }
      })
      
      console.log("detailed result: ----------", detailedResults);
      
      

   } catch (error) {
    console.log("error : ", error);
    throw new ApiError(500,"error in code executing")
   }
})

const submission = await db.submissions.create({
   data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(languageId),
      stdin: stdin.join('\n'),
      stdout: JSON.stringify(detailedResults.map(r => r.stdout)),
      stderr: detailedResults.some()
   }
})

export {executeCode, submission}