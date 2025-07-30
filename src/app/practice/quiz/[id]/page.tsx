import QuizForm from "@/components/QuizForm";
import { getQuiz } from "@/lib/actions/languages";

const Quiz = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const quizQuestion = await getQuiz(id);
  return (
    <div className="p-6 sm:p-8 bg-gray-50 dark:bg-[#111827] min-h-screen">
      <h2 className="text-center text-xl font-bold">
        Test your Learning by answering this questions
      </h2>
      <QuizForm questions={quizQuestion} quizId={id} />
    </div>
  );
};

export default Quiz;
