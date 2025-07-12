"use server";

import { allowedLanguageCodes } from "@/constant/data";
import { createSupabaseClient } from "../supabase";

export async function fetchAndSaveLanguages() {
  const supabase = createSupabaseClient();

  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca2,flags"
  );
  const countries = await res.json();

  const languages = (countries as Country[])
    .map((country: Country) => ({
      name: country.name?.common,
      code: country.cca2?.toLowerCase(),
      flag_url: country.flags?.svg,
    }))
    .filter(
      (lang) =>
        lang.name &&
        lang.code &&
        lang.flag_url &&
        allowedLanguageCodes.includes(lang.code)
    );
  // Remove items without code
  languages.push({
    name: "Arabic",
    code: "ar",
    flag_url: "https://flagcdn.com/sa.svg", // Saudi Arabia 🇸🇦
  });

  // ✅ Add English manually
  languages.push({
    name: "English",
    code: "en",
    flag_url: "https://flagcdn.com/us.svg", // United States 🇺🇸 or 'gb' for UK
  });

  console.log("Languages:", languages);

  const { data, error } = await supabase.from("languages").insert(languages);

  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Inserted successfully:", data);
  }

  return data;
}
export const getLanguages = async () => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("languages").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const saveLesson = async ({
  language_id,
  topic_id,
  duration,
  level,
}: {
  language_id: string;
  topic_id: string;
  duration: number;
  level: string;
}) => {
  const supabase = createSupabaseClient();
  const { error } = await supabase.from("lessons").insert({
    language_id,
    topic_id,
    duration,
    level,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};
export const getLessons = async () => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(`*, languages(name, flag_url), topics(name)`);

  if (error) throw new Error(error.message);
  return data;
};

export const getConversation = async (language_id: string, id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("language_id", language_id)
    .eq("topic_id", id);

  if (error) throw new Error(error.message);
  return data;
};
export const fetchQuizQuestions = async (language: string, level: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("language", language)
    .eq("level", level)
    .limit(5);

  if (error) throw new Error(error.message);
  return data;
};
