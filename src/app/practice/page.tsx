"use client";

import TTSSpeaker from "@/components/TTSSpeaker";
import UserSection from "@/components/UserSection";
import React, { useState } from "react";
import { redirect } from "next/navigation";
import Quiz from "@/components/Quiz";

const Practice = () => {
  const [speech, setSpeech] = useState(false);
  const [quiz, setQuiz] = useState(false);

  const handleQuiz = () => {
    setQuiz(true);
    setSpeech(false);
  };
  const handleSpeech = () => {
    setSpeech(true);
    setQuiz(false);
  };
  return (
    <main className="h-[90vh]">
      <UserSection />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        🎯 Practice
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="practice-section">
          <h3>🔊 Listening</h3>
          <p>
            You can write any word or phrase and get it as audio to improve your
            listening skills.
          </p>
          <button className="button" onClick={handleSpeech}>
            Start Listening
          </button>
        </div>
        <div className="practice-section">
          <h3>🗣️ Speaking</h3>
          <p>
            you can have a converstion with AI to improve your pronunciation and
            speaking and listening.
          </p>
          <button className="button" onClick={() => redirect("/createLesson")}>
            Start Speaking
          </button>
        </div>
        <div className="practice-section">
          <h3>🧠 Quiz</h3>
          <p>Test your knowledge with quick quizzes.</p>
          <button className="button" onClick={handleQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
      <div>
        {speech && <TTSSpeaker setSpeech={setSpeech} />}
        {quiz && <Quiz setQuiz={setQuiz} />}
      </div>
    </main>
  );
};

export default Practice;
