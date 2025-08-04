import LessonCard from "@/components/LessonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UserSection from "@/components/UserSection";
import { getUserLessons, getUserQuizzes } from "@/lib/actions/languages";
import QuizCard from "@/components/QuizCard";
import Link from "next/link";

const Dashboard = async () => {
  const user = await auth();
  if (!user.isAuthenticated) redirect("/sign-in");

  const lessons = await getUserLessons(user.userId!);
  const quizzes = await getUserQuizzes(user.userId!);
  return (
    <main className="min-h-screen">
      {/* Greeting */}

      <UserSection />

      {/* Lessons */}
      <main>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          📚 Your Lessons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.length > 0 ? (
            lessons.map((lesson) => <LessonCard key={lesson.id} {...lesson} />)
          ) : (
            <div className="text-center flex flex-col gap-2">
              <p className="text-gray-600 dark:text-gray-400">
                You haven't taken any lessons yet.
              </p>
              <Link href="/lessons/createLesson" className="button">
                Start lesson
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Quizzes */}
      <main>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          🧠 Your Quizzes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => <QuizCard key={quiz.id} {...quiz} />)
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              You haven't taken any quizzes yet.
            </p>
          )}
        </div>
      </main>
    </main>
  );
};

export default Dashboard;
