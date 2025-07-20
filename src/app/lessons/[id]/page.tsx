import { getLesson } from "@/lib/actions/languages";
import { auth } from "@clerk/nextjs/server";

const lessonId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { userId } = await auth();
  const lesson: Lesson = await getLesson(id, userId!);
  return <div>{lesson.language}</div>;
};

export default lessonId;
