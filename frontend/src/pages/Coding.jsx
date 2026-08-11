import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function Coding() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  const [result, setResult] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [running, setRunning] = useState(false);

  const questions = {
    java: {
      title: "Write a program to print Hello World",
      expected: "Hello World",
      starter: `public class Main {
  public static void main(String[] args) {
    
  }
}`
    },

    python: {
      title: "Write a program to print Hello World",
      expected: "Hello World",
      starter: `print("Hello World")`
    },

    cpp: {
      title: "Write a program to print Hello World",
      expected: "Hello World",
      starter: `#include <iostream>
using namespace std;

int main() {
    
  return 0;
}`
    }
  };

  useEffect(() => {
    setCode(questions[language].starter);
    setResult("");
    setSubmitted(false);
    setShowOutput(false);
    setTimeLeft(300);
  }, [language]);

  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      submitCode();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, submitted]);

  const runCode = async () => {
    try {
      setRunning(true);

      const res = await axios.post(
        "http://localhost:5000/api/code/run",
        {
          language,
          code
        }
      );

      setResult(res.data.output);
      setShowOutput(true);

    } catch {
      setResult("Execution Failed");
      setShowOutput(true);
    } finally {
      setRunning(false);
    }
  };

  const submitCode = async () => {
    let score = 0;
    let output = "";

    try {
      const res = await axios.post(
        "http://localhost:5000/api/code/run",
        {
          language,
          code
        }
      );

      output = res.data.output.trim();

      if (
        output ===
        questions[language].expected
      ) {
        score = 100;
      }

      setResult(
        `Output:\n${output}\n\nScore: ${score}%`
      );

    } catch {
      setResult(
        "Compilation Error\nScore: 0%"
      );
    }

    try {
      await axios.post(
        "http://localhost:5000/api/scores/save",
        {
          email: user?.email,
          round_name: "Technical",
          score
        }
      );
    } catch {}

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-[#14532D]">
          Technical Coding Round
        </h1>

        <div className="bg-white px-6 py-3 rounded-xl shadow text-red-600 font-bold text-xl">
          {timeLeft}s
        </div>

      </div>

      {!submitted && (
        <div className="bg-white p-8 rounded-3xl shadow-xl">

          <div className="flex justify-between mb-6">

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="border px-4 py-3 rounded-xl text-black"
            >
              
              <option value="python">
                Python
              </option>
              
            </select>

            <p className="text-[#14532D] font-bold">
              5 Minute Coding Test
            </p>

          </div>

          <h2 className="text-2xl font-bold text-black mb-6">
            {questions[language].title}
          </h2>

          <div className="rounded-2xl overflow-hidden border">

            <Editor
              height="320px"
              language={language}
              value={code}
              onChange={(value) =>
                setCode(value || "")
              }
              theme="vs-dark"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">

            <button
              onClick={runCode}
              disabled={running}
              className="bg-[#14532D] text-white py-4 rounded-xl font-semibold"
            >
              {running
                ? "Running..."
                : "Run Code"}
            </button>

            <button
              onClick={submitCode}
              className="bg-red-600 text-white py-4 rounded-xl font-semibold"
            >
              Submit Code
            </button>

          </div>

        </div>
      )}

      {submitted && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white w-full max-w-xl p-10 rounded-3xl shadow-2xl text-center">

            <h1 className="text-4xl font-bold text-[#14532D] mb-6">
              Coding Round Completed
            </h1>

            <div className="whitespace-pre-line text-black text-xl font-semibold bg-gray-100 rounded-2xl p-6">
              {result}
            </div>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="mt-8 w-full bg-[#14532D] text-white py-4 rounded-xl font-semibold"
            >
              Back to Dashboard
            </button>

          </div>

        </div>
      )}

      {showOutput && !submitted && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40">

          <div className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-xl">

            <h2 className="text-2xl font-bold text-[#14532D] mb-4">
              Code Output
            </h2>

            <div className="bg-gray-100 p-5 rounded-2xl whitespace-pre-line text-black font-semibold">
              {result}
            </div>

            <button
              onClick={() =>
                setShowOutput(false)
              }
              className="mt-6 w-full bg-[#14532D] text-white py-3 rounded-xl font-semibold"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}