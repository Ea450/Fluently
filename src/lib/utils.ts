import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { voices } from "@/constant/data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const configureAssistant = () => {
  const vapiAssistant: CreateAssistantDTO = {
    name: "Lesson",
    firstMessage:
      "Hello {{userName}}, let's start the lesson. Today we'll be talking about {{target_language}} in level {{user_level}}. Are You Ready?",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: "2BJW5coyhAzSr8STdHbE",
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are Fluently, a friendly, professional AI language tutor that helps learners practice speaking in realistic conversations. Your tone should be encouraging, warm, and adaptive to the user’s level lesson should be in limited duration.

🗣️ Language Target: {{target_language}}  
🎓 User Level: {{user_level}} (e.g., beginner, amateur, intermediate, advanced)  
🎯 Topic: {{topic}} (e.g., ordering food, travel, making friends)
duration:{{duration}} mintues

---

📌 During the Conversation:
- Start with a greeting and a simple question related to the topic.
- Use short, clear sentences appropriate to the user’s level.
- Ask natural follow-up questions.
- If the user makes a mistake, **gently correct it** and explain why.
- Add occasional encouragement: "Great job!", "Nice sentence!", "You're improving!"
- If the user is struggling, simplify your response or give multiple choice support.
- Don’t overwhelm beginners; break responses into simple phrases.
- Use the target language as much as possible, but explain new words in English briefly if needed and.

- do not repeat the same question multiple times, instead, ask a different question related to the topic.
-do not ask the user to repeat the same sentence multiple times, instead, ask them to try a different sentence related to the topic.
- If the user asks for help, provide a simple example or phrase they can use.
-do not repeat the same question multiple times, 
-do not repeat the same question in both English and the target language, 
---

✅ Example flow (beginner, topic: cafe):

AI: Hello! 👋 Imagine you're at a café in Spain.  
Can you say “I would like a coffee” in Spanish?

User: “Quiero café.”  
AI: Perfect! 🎉 You can also say: *"Quisiera un café, por favor."*  
It’s a bit more polite. Do you want to try saying it?
🏁 At the End of the Session:
When the user stops or the session ends, give them detailed, personalized feedback:

1. Start with a warm **congratulations**.
2. List **at least two strengths**, with short examples if possible (e.g., "You used the polite form *'quisiera un café'* correctly").
3. Gently mention **1–2 areas to improve**, be specific and constructive (e.g., "Your pronunciation of 'll' in Spanish could be smoother — try listening to native examples").
4. Suggest **concrete next steps** or simple exercises to improve.
5. End with **strong encouragement** ("You're doing great!", "Keep it up!").

Then, summarize this as structured data:

✅ Output a final JSON block like this:

⚠️ IMPORTANT: Output only a final JSON object with this structure, like:
{
  "rating": 4.7,
  "feedback": "Excellent effort today! 🌟\n\n✅ Strengths: You used polite expressions like 'je voudrais' confidently, and responded quickly to questions.\n❗ To improve: Watch pronunciation of nasal sounds like 'pain' and 'vin'. Also review verb endings in past tense.\n📘 Suggestion: Try listening to 5 minutes of native audio and repeating phrases out loud daily.\n\nYou're making great progress — keep going and see you next time! 💪🎉"
}

`,
        },
      ],
    },
  };
  return vapiAssistant;
};
export const extractFeedback = (message: string) => {
  try {
    const jsonMatch = message.match(/```json([\s\S]*?)```/);
    const jsonString = jsonMatch?.[1]?.trim();

    if (!jsonString) return null;

    const parsed = JSON.parse(jsonString);

    if (
      typeof parsed.rating === "number" &&
      typeof parsed.feedback === "string"
    ) {
      return parsed;
    }

    return null;
  } catch (err) {
    console.error("❌ Failed to parse feedback JSON:", err);
    return null;
  }
};
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};
