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
  question: string;
  choices: string[];
  correct_answer_index: number;
};
