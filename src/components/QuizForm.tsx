"use client";

import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

const QuizForm = ({ questions }: { questions: Question[] }) => {
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [explode, setExplode] = useState(false);

  const handleSelect = (questionIndex: number, choiceIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = choiceIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setExplode(true);

    // Optional: auto stop confetti after 3 seconds
    setTimeout(() => setExplode(false), 3000);
  };

  const score = answers.reduce((acc, answer, idx) => {
    if (answer === questions[idx].correct_answer_index) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="p-4 space-y-4 border mt-10 rounded-2xl relative overflow-hidden">
      {questions.map((q, i) => (
        <div key={i}>
          <p className="font-semibold mb-3">
            {i + 1}. {q.question}
          </p>
          <p className="mb-3">Question in English : {q.question_en}</p>
          <div className="grid grid-cols-2 gap-2 text-black">
            {q.choices.map((choice, j) => {
              const isSelected = answers[i] === j;
              const isCorrect = j === q.correct_answer_index;

              const showColor =
                submitted && isSelected
                  ? isCorrect
                    ? "bg-green-200 border-green-500"
                    : "bg-red-200 border-red-500"
                  : submitted && !isSelected && isCorrect
                  ? "bg-green-100 border-green-400"
                  : isSelected
                  ? "bg-blue-100 border-blue-300"
                  : "bg-gray-50";

              return (
                <button
                  key={j}
                  disabled={submitted}
                  onClick={() => handleSelect(i, j)}
                  className={`p-2 rounded border w-full text-center ${showColor}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-center mt-6">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Submit Quiz
          </button>
        ) : (
          <p className="font-bold text-xl">
            Your score: {score}/{questions.length}
          </p>
        )}
      </div>

      {/* 🎉 Confetti on Submit */}
      {explode && score > 5 && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <ConfettiExplosion />
        </div>
      )}
    </div>
  );
};

export default QuizForm;
