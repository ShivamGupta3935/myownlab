import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {getJudge0LanguageId, pollBatchResults, submitBatch} from '../libs/judge0.lib.js'
import { db } from "../libs/db.js";
const executeCode = asyncHandler(async (req, res) => {
  const { source_code, languageId, stdin, expected_outputs, problemId } = req.body;
  const userId = req.user?.id;

  if (
  !Array.isArray(stdin) ||
  !Array.isArray(expected_outputs) ||
  stdin.length === 0 ||
  stdin.length !== expected_outputs.length
) {
  throw new ApiError(400, "invalid data");
}

  const submissions = stdin.map((input) => ({
    source_code,
    languageId,
    stdin: input
  }));

  const submitResponse = await submitBatch(submissions);
  const tokens = submitResponse.map(res => res.token);
  const results = await pollBatchResults(tokens);

  let allPassed = true;

  const detailedResults = results.map((result, idx) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[idx]?.trim();
    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    return {
      testCase: idx + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compileOutput: result.compileOutput || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory}KB` : undefined,
      time: result.time ? `${result.time}s` : undefined
    };
  });

  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(languageId),
      stdin: stdin.join('\n'),
      stdout: JSON.stringify(detailedResults.map(r => r.stdout)),
      stderr: detailedResults.some(r => r.stderr)
    }
  });

  return res.json(new ApiResponse(200, submission, "Executed successfully"));
});
export {executeCode}