"use server";

import { createSupabaseClient } from "../supabase";
import { auth } from "@clerk/nextjs/server";

// lessons functions
export const CreateLesson = async (
  language: string,
  level: string,
  topic: string
) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      user_id: userId,
      language: language,
      level: level,
      topic: topic,
    })
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const getLesson = async (lessonId: string, userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .select()
    .eq("user_id", userId)
    .eq("id", lessonId);

  if (error) throw new Error(error.message);
  return data[0];
};

// quiz functions
export const getQuiz = async () => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw new Error(error.message);
  return data;
};
export const createQuiz = async (FormData: CreateQuiz) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();
  const quiz = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("language", FormData.language)
    .eq("level", FormData.level)
    .limit(10);
  if (quiz.error) throw new Error(quiz.error.message);
  quiz.data?.map(
    async (data) =>
      await supabase
        .from("quizzes")
        .insert({
          author,
          ...data,
        })
        .select()
  );
  return quiz.data;
};
