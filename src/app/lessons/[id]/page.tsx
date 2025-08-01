import AIConversation from "@/components/AIConversation";
import { getLesson } from "@/lib/actions/languages";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const lessonId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const lesson: Lesson = await getLesson(id, user.id);
  const { language, duration, level, topic } = lesson;
  return (
    <main className="mx-auto px-14 flex flex-col gap-8 pt-10 max-sm:px-2 mb-5">
      <article className="flex rounded-border justify-between p-6 max-md:flex-col border-2 border-black rounded-2xl items-center">
        <div className="flex items-center gap-2">
          <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden">
            <Image
              src={user.imageUrl}
              alt={user.firstName! || "user"}
              width={35}
              height={35}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{language}</p>
              <div className="subject-badge max-sm:hidden">({level})</div>
            </div>

            <p className="text-md">
              this is lesson about {topic} in {language} we will help you to
              improve your skills and knowledge in this language.
            </p>
          </div>
        </div>
        <div className="text-center max-md:hidden">{duration} minutes</div>
      </article>
      <AIConversation
        target_language={language}
        topic={topic}
        user_level={level}
        key={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
        lessonId={lesson.id}
        duration={duration}
      />
    </main>
  );
};

export default lessonId;
