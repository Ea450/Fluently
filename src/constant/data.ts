export const lessons = [
  { id: "1", title: "Greetings", progress: 0.6 },
  { id: "2", title: "Food & Drinks", progress: 0.2 },
  { id: "3", title: "Travel", progress: 0 },
  { id: "4", title: "Family & Friends", progress: 0.8 },
  { id: "5", title: "Shopping", progress: 0.1 },
];

export const topics = [
  { id: "1", title: "Greetings" },
  { id: "2", title: "Food & Drinks" },
  { id: "3", title: "Travel" },
  { id: "4", title: "Family & Friends" },
  { id: "5", title: "Shopping" },
  { id: "6", title: "Work & Business" },
  { id: "7", title: "Daily Conversation" },
  { id: "8", title: "Numbers & Dates" },
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

export const voices = {
  male: { casual: "2BJW5coyhAzSr8STdHbE", formal: "c6SfcYrb2t09NHXiT80T" },
  female: { casual: "ZIlrSGI4jZqobxRKprJz", formal: "sarah" },
};
