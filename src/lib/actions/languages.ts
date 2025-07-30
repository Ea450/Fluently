"use server";

import { createSupabaseClient } from "../supabase";
import { auth } from "@clerk/nextjs/server";

// quiz functions
export const getQuiz = async (quizId: string): Promise<Question[]> => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("quiz_question_links")
    .select(
      `
      quiz_questions (
        id,
        category,
        question,
        question_en,
        choices,
        correct_answer_index,
        language,
        level
      )
    `
    )
    .eq("quiz_id", quizId);

  if (error) {
    throw new Error(`Failed to fetch quiz questions: ${error.message}`);
  }

  // Flatten the nested quiz_questions object
  const questions: Question[] = data.map((row) => row.quiz_questions).flat();

  return questions;
};
export const createQuiz = async (formData: CreateQuiz) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  // Fetch 10 questions
  const questionsRes = await supabase
    .from("quiz_questions")
    .select("id, language, level")
    .eq("language", formData.language)
    .eq("level", formData.level)
    .limit(10);

  if (questionsRes.error) throw new Error(questionsRes.error.message);
  const questions = questionsRes.data;

  // Create quiz
  const quizRes = await supabase
    .from("quizzes")
    .insert({
      language: formData.language,
      level: formData.level,
      author,
    })
    .select("id")
    .single();

  if (quizRes.error) throw new Error(quizRes.error.message);
  const quizId = quizRes.data.id;

  // Link quiz and questions
  const linkRows = questions.map((q) => ({
    quiz_id: quizId,
    question_id: q.id,
  }));

  const linksInsert = await supabase
    .from("quiz_question_links")
    .insert(linkRows);

  if (linksInsert.error) throw new Error(linksInsert.error.message);

  return quizId;
};
export const updateQuizScore = async (score: number, quizId: string) => {
  const supabase = createSupabaseClient();
  const { userId } = await auth();

  const { data, error } = await supabase
    .from("quizzes")
    .update({ score: score })
    .eq("id", quizId)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};
export const getUserQuizzes = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("author", userId)
    .limit(5);
  if (error) throw new Error(error.message);
  return data;
};

// lessons functions
export const CreateLesson = async (
  language: string,
  level: string,
  topic: string,
  duration: number
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
      duration,
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
export const getUserLessons = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("user_id", userId)
    .limit(5);
  if (error) throw new Error(error.message);
  return data;
};

export const saveRateAndFeedback = async (
  lessonId: string,
  rate: number,
  feedback: string
) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("lessons")
    .update({
      rate: rate,
      feedback: feedback,
    })
    .eq("id", lessonId);

  if (error) {
    throw new Error(error.message);
  }
  console.log("supabse updated", data);
};
