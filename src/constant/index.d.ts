interface Country {
  name?: { common?: string };
  cca2?: string;
  flags?: { svg?: string };
}
interface Languages {
  id: string;
  name: string;
  code: string;
  flag_url: string;
}
type Question = {
  id: string;
  category: string;
  question: string;
  question_en: string;
  choices: string[];
  correct_answer_index: number;
  language: string;
  level: string;
};
interface CreateQuiz {
  language: string;
  level: string;
}
type Lesson = {
  id: string;
  language: string;
  level: string;
  topic: string;
  duration: number;
};
interface AIConversationProps {
  target_language: string;
  user_level: string;
  topic: string;
  userName: string;
  userImage: string;
  lessonId: string;
  duration: number;
}
interface QuizProps {
  setQuiz: (value: boolean) => void;
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
interface LessonCardProps {
  id: string;
  level: string;
  language: string;
  rate: number;
}
interface QuizCardProps {
  id: string;
  level: string;
  language: string;
  score: number;
}

interface FeedbackItem {
  id: string;
  language: string;
  level: string;
  topic: string;
  rate: number;
  feedback: string;
  created_at: string;
}

interface FeedbackAnalytics {
  totalLessons: number;
  averageRating: number;
  languageStats: {
    language: string;
    count: number;
    averageRating: number;
  }[];
}
