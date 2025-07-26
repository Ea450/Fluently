import React from "react";
import FormOptions from "./FormOptions";

const Quiz = ({ setQuiz }: QuizProps) => {
  return (
    <div>
      <div className="p-4 space-y-4 border mt-10 rounded-2xl text-center relative">
        <h2 className="text-2xl">🧠 Quiz</h2>
        <button
          onClick={() => setQuiz(false)}
          className="text-gray-500 hover:text-red-800 dark:hover:text-red-950 cursor-pointer absolute top-4 right-4"
        >
          Close ❌
        </button>
        <FormOptions />
      </div>
    </div>
  );
};

export default Quiz;
