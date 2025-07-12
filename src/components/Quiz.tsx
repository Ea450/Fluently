"use client";

import { useState } from "react";

const Quiz = ({ questions }: { questions: Question[] }) => {
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionIndex: number, choiceIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = choiceIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = answers.reduce((acc, answer, idx) => {
    if (answer === questions[idx].correct_answer_index) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={q.id}>
          <p className="font-semibold">
            {i + 1}. {q.question}
          </p>
          <div className="grid grid-cols-2 gap-2 text-black">
            {q.choices.map((choice, j) => (
              <button
                key={j}
                onClick={() => handleSelect(i, j)}
                className={`p-2 rounded border 
                  ${answers[i] === j ? "bg-blue-100" : "bg-gray-50"}`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <p className="font-bold text-xl">
          Your score: {score}/{questions.length}
        </p>
      )}
    </div>
  );
};
export default Quiz;
