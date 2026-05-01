import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams, Link } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Play,
} from "lucide-react";

import { useProblemStore } from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLanguageId } from "../lib/lang";

const ProblemPage = () => {
  const { id } = useParams();


  const { isProblemLoading, problem, getProblemById } = useProblemStore();

  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("description");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  const {isExecuting, submission, executeCode} = useExecutionStore()

  // Fetch problem
  useEffect(() => {
    if (id) getProblemById(id);
  }, [id]);

  // Sync problem data
  useEffect(() => {
    if (!problem) return;

    setCode(problem.codeSnippets?.[selectedLanguage] || "javascript");

    setTestCases(
      problem.testcases?.map((tc) => ({
        input: tc.input,
        output: tc.output,
      })) || [],
    );
  }, [problem, selectedLanguage]);

  // ✅ Loading UI
  if (isProblemLoading) {
    return (
      <div className="p-6 animate-pulse space-y-4">
        <div className="h-8 bg-base-300 rounded w-1/3"></div>
        <div className="h-40 bg-base-300 rounded"></div>
      </div>
    );
  }

  // ✅ Error / empty state
  if (!problem) {
    return (
      <div className="p-6 text-red-500 font-semibold">Problem not found</div>
    );
  }

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <div
                    key={lang}
                    className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                  >
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 font-semibold">
                        Input:
                      </div>
                      <span className="bg-black/90 px-3 py-1 rounded text-white">
                        {example.input}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 font-semibold">
                        Output:
                      </div>
                      <span className="bg-black/90 px-3 py-1 rounded text-white">
                        {example.output}
                      </span>
                    </div>

                    {example.explanation && (
                      <p className="text-base-content/70">
                        {example.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-4 rounded-xl">
                  {problem.constraints}
                </div>
              </>
            )}
          </div>
        );

      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );

      case "hints":
        return problem.hints ? (
          <div className="bg-base-200 p-4 rounded-xl">{problem.hints}</div>
        ) : (
          <div className="text-center text-base-content/70">
            No hints available
          </div>
        );

      default:
        return null;
    }
  };

  const handleRunCode = (e) => {
     e.preventDefault()
     try {
        const language_id = getLanguageId(selectedLanguage)
        const stdin = problem.testcases.map(tc => tc.input)
        const expected_output = problem.testcases.map(tc => tc.output)
        executeCode(code, language_id, stdin, expected_output, id)
     } catch (error) {
        console.log("Error in solution code");        
     }
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <nav className="navbar bg-base-100 shadow px-4">
        <div className="flex-1 gap-2">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Home className="w-5 h-5" />
            <ChevronRight className="w-4 h-4" />
          </Link>

          <div>
            <h1 className="text-xl font-bold">{problem.title}</h1>

            <div className="flex gap-3 text-sm text-base-content/70 mt-2">
              <Clock className="w-4 h-4" />
              <span>
                Updated {new Date(problem.createdAt).toLocaleDateString()}
              </span>

              <Users className="w-4 h-4" />
              <span>10 Submissions</span>

              <ThumbsUp className="w-4 h-4" />
              <span>95% Success</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>

          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>

          <select
            className="select select-bordered"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* Main */}
      <div className="grid lg:grid-cols-2 gap-6 p-4">
        {/* Left */}
        <div className="card bg-base-100 shadow">
          <div className="tabs tabs-bordered">
            {["description", "discussion", "hints"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "tab-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4">{renderTabContent()}</div>
        </div>

        {/* Right */}
        <div className="card bg-base-100 shadow">
          <div className="tabs tabs-bordered">
            <div className="tab tab-active flex gap-2">
              <Terminal className="w-4 h-4" />
              Editor
            </div>
          </div>

          <div>
            <Editor
              height="500px"
              language={selectedLanguage.toLowerCase()}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 20,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </div>
          <div className="p-4 flex justify-between">
            <button className={`btn btn-primary ${isExecuting ? "loading" : ""}`} onClick={handleRunCode}
            disabled={isExecuting}
            >
              {!isExecuting && <Play className="w-4 h-4"/>}
              Run code
            </button>
            <button className="btn btn-success">Submit Solution</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
