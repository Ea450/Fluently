"use client";
import HandleSpeaking from "@/components/HandleSpeaking";
import Quiz from "@/components/Quiz";
import TTSSpeaker from "@/components/TTSSpeaker";
import UserSection from "@/components/UserSection";
import React, { useState } from "react";

const Practice = () => {
  const [speaking, setSpeaking] = useState(false);
  const [speech, setSpeech] = useState(false);
  const [quiz, setQuiz] = useState(false);
  return (
    <section className="p-6 sm:p-8 bg-gray-50 dark:bg-[#111827] min-h-screen">
      <UserSection />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        🎯 Practice
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-2">🔊 Listening</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You can write any word or phrase and get it as audio to improve your
            listening skills.
          </p>
          <button className="button" onClick={() => setSpeech(true)}>
            Start Listening
          </button>
        </div>
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-2">🗣️ Speaking</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            you can have a converstion with AI to improve your pronunciation and
            speaking and listening.
          </p>
          <button className="button" onClick={() => setSpeaking(true)}>
            Start Speaking
          </button>
        </div>
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-2">🧠 Quiz</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Test your knowledge with quick quizzes.
          </p>
          <button className="button" onClick={() => setQuiz(true)}>
            Start Quiz
          </button>
        </div>
      </div>
      <div>
        {speaking && <HandleSpeaking setSpeaking={setSpeaking} />}
        {speech && <TTSSpeaker setSpeech={setSpeech} />}
      </div>
    </section>
  );
};

export default Practice;
