"use client";

import { useState } from "react";

export default function QuizEngine({ config, onRestart }) {
  const { questions, title } = config;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleAnswerClick = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer.correct) setScore(score + 1);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 80;

    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl text-center border border-gray-100">
        <h1 className="text-3xl font-bold mb-2">Test Results</h1>
        <p className="text-gray-500 mb-6">{title}</p>
        
        <div className={`inline-block p-6 rounded-full mb-6 ${passed ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          <span className="text-5xl font-black">{percentage}%</span>
        </div>

        <p className="text-xl mb-8 font-medium">
          {passed ? "🎉 Passed! You're ready for MPI." : "❌ Failed. Practice makes perfect!"}
          <br />
          <span className="text-sm text-gray-500 font-normal">({score} out of {questions.length} correct)</span>
        </p>

        <div className="flex gap-4 justify-center">
          <button onClick={onRestart} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition">
            Main Menu
          </button>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg shadow-blue-100 transition">
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <header className="mb-6 pb-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={onRestart}
            className="flex items-center text-sm font-bold text-gray-400 hover:text-blue-600 transition"
          >
            ← RETURN TO MENU
          </button>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            QUESTION {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div>
          <h1 className="text-sm font-black text-gray-400 uppercase tracking-widest">{title}</h1>
          <div className="w-full bg-gray-100 h-2 mt-3 rounded-full overflow-hidden">
             <div 
               className="bg-blue-600 h-full transition-all duration-500" 
               style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
             ></div>
          </div>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-tight">
          {currentQ.question_text}
        </h2>
        
        {currentQ.imgUrl && (
          <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-center border border-gray-100">
            <img src={currentQ.imgUrl} alt="Road Scene" className="max-h-60 object-contain" />
          </div>
        )}

        <div className="grid gap-3">
          {currentQ.answers.map((ans, idx) => {
            let btnClass = "w-full text-left p-5 rounded-xl border-2 transition-all duration-150 font-medium ";
            if (!isAnswered) {
              btnClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50";
            } else if (ans.correct) {
              btnClass += "bg-green-50 border-green-500 text-green-800";
            } else if (selectedAnswer === ans && !ans.correct) {
              btnClass += "bg-red-50 border-red-500 text-red-800";
            } else {
              btnClass += "bg-gray-50 border-gray-100 opacity-60";
            }

            return (
              <button key={idx} disabled={isAnswered} onClick={() => handleAnswerClick(ans)} className={btnClass}>
                {ans.answerText}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 mb-6">
            <h3 className="text-xs font-black text-blue-800 uppercase mb-2">Why is this correct?</h3>
            <p className="text-blue-900 leading-relaxed text-sm">{currentQ.ai_advice}</p>
          </div>
          
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg shadow-blue-100"
          >
            {currentIndex + 1 === questions.length ? "FINISH TEST" : "CONTINUE →"}
          </button>
        </div>
      )}
    </div>
  );
}