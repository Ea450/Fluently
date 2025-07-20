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
      <AIConversation />
    </div>
  );
};

export default lessonId;
