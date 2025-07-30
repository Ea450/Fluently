import LessonCard from "@/components/LessonCard";
import UserSection from "@/components/UserSection";
import { getUserLessons } from "@/lib/actions/languages";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Lessons = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const lessons = await getUserLessons(userId);
  return (
    <main className="h-[90vh]">
      <UserSection />
      <main>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Here you can find all your lessons. Click on a lesson to start
          learning!
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          📚 Your Lessons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </div>
      </main>
    </main>
  );
};

export default Lessons;
