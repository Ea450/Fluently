import AIConversation from "@/components/AIConversation";
import { getLesson } from "@/lib/actions/languages";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const lessonId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }
  const lesson: Lesson = await getLesson(id, userId);
  return (
    <div>
      <AIConversation
        target_language={lesson.language}
        topic={lesson.topic}
        user_level={lesson.level}
        key={id}
      />
    </div>
  );
};

export default lessonId;
