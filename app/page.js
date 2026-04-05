"use client";

import { useState } from "react";
import quizData from "../components/assets/quiz_data/quiz_data.json";
import signData from "../components/assets/quiz_data/sign_data.json";
import QuizEngine from "../components/QuizEngine";

export default function Home() {
  const [testConfig, setTestConfig] = useState(null);
  const [count, setCount] = useState(30); // Defaulting to the standard exam length

  const counts = [10, 15, 20, 25, 30];

  const startTest = (type) => {
    let pool = type === 'signs' ? signData : quizData;
    // Shuffle and slice
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setTestConfig({
      questions: shuffled.slice(0, count),
      type: type,
      title: type === 'signs' ? `Road Signs (${count} Qs)` : `Class 5 Mock Test (${count} Qs)`
    });
  };

  if (testConfig) {
    return <QuizEngine config={testConfig} onRestart={() => setTestConfig(null)} />;
  }

  return (
    <main className="max-w-4xl mx-auto mt-12 p-6 text-center">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-2">MPI Practice Test</h1>
      <p className="text-gray-500 mb-8">Prepare for the Manitoba Knowledge Test</p>

      {/* Question Count Toggle */}
      <div className="mb-10">
        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
          Number of Questions
        </label>
        <div className="inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
          {counts.map((num) => (
            <button
              key={num}
              onClick={() => setCount(num)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                count === num 
                ? "bg-white text-blue-600 shadow-md transform scale-105" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button 
          onClick={() => startTest('all')}
          className="group relative p-8 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all overflow-hidden text-left"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">General Knowledge</h2>
            <p className="text-blue-100 text-sm">Rules, laws, and safety</p>
          </div>
        </button>

        <button 
          onClick={() => startTest('signs')}
          className="group relative p-8 bg-amber-500 text-white rounded-2xl shadow-xl hover:bg-amber-600 transition-all overflow-hidden text-left"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Road Signs</h2>
            <p className="text-amber-50 text-sm">Regulatory and warning signs</p>
          </div>
        </button>
      </div>
    </main>
  );
}