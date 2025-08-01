import { getLesson } from "@/lib/actions/languages";
import { currentUser } from "@clerk/nextjs/server";

import Image from "next/image";
import { redirect } from "next/navigation";

const feedbackId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const lesson: Lesson = await getLesson(id, user.id);
  const { language, duration, level, topic, feedback } = lesson;

  return (
    <main className="min-h-screen px-4 py-8">
      {/* Lesson Header */}
      <article className="flex justify-between gap-6 flex-col md:flex-row items-center border-2 border-black rounded-2xl p-6">
        <div className="flex items-center gap-4 w-full">
          <div className="hidden md:flex items-center justify-center">
            <Image
              src={user.imageUrl}
              alt={user.firstName!||'user'}
              width={64}
              height={64}
              className="rounded-lg border border-black"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{language}</p>
              <span className="subject-badge max-sm:hidden">({level})</span>
            </div>

            <p className="text-md">
              This is a lesson about <strong>{topic}</strong> in {language}. We
              will help you improve your skills and knowledge in this language.
            </p>
          </div>
        </div>

        <div className="text-center text-sm font-medium max-md:mt-4 max-md:text-base">
          ⏱ {duration} minutes
        </div>
      </article>

      <article className="mt-6">
        <div className="p-6 border-2 border-black rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-3">Feedback</h2>
          <p className="leading-relaxed whitespace-pre-line">
            {feedback || "No feedback provided yet."}
          </p>
        </div>
      </article>
    </main>
  );
};

export default feedbackId;
