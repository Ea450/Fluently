import LessonCard from "@/components/LessonCard";
import { lessons } from "@/constant/data";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UserSection from "@/components/UserSection";
import Link from "next/link";

const Dashboard = async () => {
  const userAuth = await auth();
  if (!userAuth.isAuthenticated) redirect("/sign-in");
  return (
    <main className="p-6 sm:p-8 bg-gray-50 dark:bg-[#111827] min-h-screen">
      {/* Greeting */}

      <UserSection />

      {/* Streak and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">🔥 Daily Streak</h2>
          <p className="text-4xl font-bold text-blue-600">5 Days</p>
          <p className="text-gray-500 dark:text-gray-400">
            Keep going! Your longest streak is 12 days.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">📊 Progress Summary</h2>
          <p className="text-lg mb-1">
            Spanish: <span className="font-bold">60%</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `60%` }}
            ></div>
          </div>
          <p className="text-lg mb-1">
            French: <span className="font-bold">20%</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `20%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          📚 Your Lessons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </div>
      </section>

      {/* Practice Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          🎯 Practice
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
            <h3 className="text-xl font-semibold mb-2">🔊 Listening</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You can write any word or phrase and get it as audio to improve
              your listening skills.
            </p>
            <Link href="/practice" className="button">
              Start Listening
            </Link>
          </div>
          <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
            <h3 className="text-xl font-semibold mb-2">🗣️ Speaking</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              you can have a converstion with AI to improve your pronunciation
              and speaking and listening.
            </p>
            <Link href="/practice" className="button">
              Start Speaking
            </Link>
          </div>
          <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
            <h3 className="text-xl font-semibold mb-2">🧠 Quiz</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Test your knowledge with quick quizzes.
            </p>
            <Link href="/practice" className="button">
              Start Quiz
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
