import QuizForm from "@/components/QuizForm";
import { getQuiz } from "@/lib/actions/languages";

const Quiz = async () => {
  const quizQuestion = await getQuiz();
  return (
    <div>
      <QuizForm questions={quizQuestion} />
    </div>
  );
};

export default Quiz;
