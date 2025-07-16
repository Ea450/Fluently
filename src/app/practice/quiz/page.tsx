import QuizForm from "@/components/QuizForm";
import { getQuiz } from "@/lib/actions/languages";

const Quiz = async () => {
  const quizQuestion = await getQuiz();
  return (
    <div className="p-6 sm:p-8 bg-gray-50 dark:bg-[#111827] min-h-screen">
      <h2 className="text-center text-xl font-bold">
        Test your Learning by answering this questions
      </h2>
      <QuizForm questions={quizQuestion} />
    </div>
  );
};

export default Quiz;
