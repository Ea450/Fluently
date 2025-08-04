export const lessons = [
  { id: "1", title: "Greetings", progress: 0.6 },
  { id: "2", title: "Food & Drinks", progress: 0.2 },
  { id: "3", title: "Travel", progress: 0 },
  { id: "4", title: "Family & Friends", progress: 0.8 },
  { id: "5", title: "Shopping", progress: 0.1 },
];

export const topics = [
  { id: 16, title: "Greetings" },
  { id: 17, title: "Food & Drinks" },
  { id: 18, title: "Travel" },
  { id: 19, title: "Family & Friends" },
  { id: 20, title: "Shopping" },
  { id: 2, title: "Work & Business" },
  { id: 21, title: "Daily Conversation" },
  { id: 22, title: "Numbers & Dates" },
  { id: 1, title: "Introducing Yourself" },
  { id: 3, title: "Talking About Your Hobbies" },
  { id: 4, title: "Making Travel Plans" },
  { id: 5, title: "Going Shopping" },
  { id: 6, title: "Daily Routine and Schedule" },
  { id: 7, title: "Describing Your Family" },
  { id: 8, title: "At the Doctor’s Office" },
  { id: 9, title: "Talking About Weather and Seasons" },
  { id: 10, title: "Job Interviews and Career Goals" },
  { id: 11, title: "Describing Places in Your City" },
  { id: 12, title: "Talking About Movies and Music" },
  { id: 13, title: "Making Small Talk with Strangers" },
  { id: 14, title: "Booking a Hotel Room" },
  { id: 15, title: "Expressing Opinions and Preferences" },
];

export const allowedLanguageCodes = [
  "en",
  "ar",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "ja",
  "zh",
  "ko",
  "hi",
  "tr",
  "nl",
  "pl",
  "sv",
  "uk",
  "vi",
  "th",
];

export const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ar", label: "Arabic" },
  { code: "ru", label: "Russian" },
  { code: "hi", label: "Hindi" },
  { code: "tr", label: "Turkish" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" },
  { code: "ko", label: "Korean" },
];

export const LangMap: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-EG",
  ru: "ru-RU",
  hi: "hi-IN",
  tr: "tr-TR",
  ja: "ja-JP",
  zh: "zh-CN",
  pt: "pt-PT",
  it: "it-IT",
  ko: "ko-KR",
};

export const levels = ["amateur", "beginner", "advanced", "intermediate"];

export const navIcons = [
  {
    id: 1,
    href: "/dashboard",
    text: "Dashboard",
  },
  {
    id: 2,
    href: "/lessons",
    text: "Lessons",
  },
  {
    id: 3,
    href: "/practice",
    text: "Practice",
  },
];
