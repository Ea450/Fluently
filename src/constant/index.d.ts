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
};
interface AIConversationProps {
  target_language: string;
  user_level: string;
  topic: string;
}
interface QuizProps {
  setQuiz: (value: boolean) => void;
}
