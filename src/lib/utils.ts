import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import OpenAI from "openai";

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
userName:{{userName}}

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
When the session ends, simply say goodbye warmly and thank the user for their participation. Let them know they did well and encourage them to keep practicing.

`,
        },
      ],
    },
  };
  return vapiAssistant;
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const generateAIFeedback = async (
  messages: ConversationMessage[],
  targetLanguage: string,
  userLevel: string,
  topic: string,
  duration: number
): Promise<FeedbackResult | null> => {
  try {
    // Prepare conversation history
    const conversationHistory = messages
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `
You are an expert language learning evaluator. Analyze this conversation between a language learner and an AI assistant.

**Context:**
- Target Language: ${targetLanguage}
- User Level: ${userLevel}
- Topic: ${topic}
- Session Duration: ${duration} minutes

**Conversation:**
${conversationHistory}

**Task:**
Provide detailed, personalized feedback for the language learner based on their performance in this conversation. Consider:

1. **Language Skills Demonstrated:**
   - Vocabulary usage and range
   - Grammar accuracy
   - Pronunciation attempts (if evident from text)
   - Conversational flow and natural responses
   - Cultural awareness and appropriate language use

2. **Engagement and Participation:**
   - Active participation in the conversation
   - Willingness to try new phrases or expressions
   - Response to corrections and guidance

3. **Progress Indicators:**
   - Improvement throughout the session
   - Confidence building
   - Understanding of context and meaning

**Provide feedback following this structure:**

1. Start with warm congratulations and encouragement
2. List at least 2-3 specific strengths with examples from the conversation
3. Mention 1-2 areas for improvement with constructive, specific advice
4. Suggest concrete next steps or exercises
5. End with strong encouragement

**Rating Criteria (1-5 scale):**
- 1.0-2.0: Beginner effort, needs significant improvement
- 2.1-3.0: Basic level, showing some understanding
- 3.1-4.0: Good progress, solid foundation
- 4.1-5.0: Excellent performance, advanced skills

**Output Format:**
Respond with ONLY a JSON object in this exact format:

{
  "rating": [number between 1.0 and 5.0],
  "feedback": "[detailed feedback string with emojis and formatting as specified above]"
}
`;

    // Send request to Groq API
    const grokResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // server-only variable
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // Use Groq-supported model
          messages: [
            {
              role: "system",
              content:
                "You are a professional language learning evaluator. Provide constructive, encouraging feedback based on conversation analysis. Always respond with valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      }
    );

    const rawText = await grokResponse.text();
    console.log("🧠 Groq raw response:", rawText);

    const result = JSON.parse(rawText);
    const response = result.choices?.[0]?.message?.content;

    if (!response) {
      console.error("❌ No response from Groq model");
      return null;
    }

    try {
      const parsed = JSON.parse(response);

      if (
        typeof parsed.rating === "number" &&
        typeof parsed.feedback === "string" &&
        parsed.rating >= 1.0 &&
        parsed.rating <= 5.0
      ) {
        return parsed;
      } else {
        console.error("❌ Invalid feedback format from Groq:", parsed);
        return null;
      }
    } catch (parseError) {
      console.error("❌ Failed to parse JSON response content:", parseError);
      console.error("❌ Raw message content:", response);
      return null;
    }
  } catch (error) {
    console.error("❌ Error generating AI feedback:", error);
    return null;
  }
};

export const generateFallbackFeedback = (
  targetLanguage: string,
  userLevel: string,
  messageCount: number
): FeedbackResult => {
  const rating = Math.min(4.5, 2.5 + messageCount * 0.1);

  const feedback = `Great effort in your ${targetLanguage} practice session! 🌟

✅ **Strengths:**
- You actively participated throughout the conversation
- Showed willingness to engage with the ${userLevel} level content
- Demonstrated commitment to learning

📈 **Areas to continue working on:**
- Keep practicing regular conversation to build fluency
- Focus on expanding your vocabulary in everyday topics

💡 **Next steps:**
- Try to have longer conversations to build confidence
- Practice with native speakers when possible

Keep up the excellent work! Every conversation brings you closer to fluency. 💪✨`;

  return { rating, feedback };
};
