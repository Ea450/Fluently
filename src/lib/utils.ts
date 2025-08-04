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

    // Try multiple free AI services in sequence
    const freeAIServices = [
      {
        name: "HuggingFace",
        url: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        transform: (data: any) => data[0]?.generated_text || "",
      },
      {
        name: "Ollama (if available)",
        url: "http://localhost:11434/api/generate",
        transform: (data: any) => data.response || "",
      },
    ];

    let aiResponse = "";

    for (const service of freeAIServices) {
      try {
        const response = await fetch(service.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `Analyze this language learning conversation and provide feedback. Target language: ${targetLanguage}, Level: ${userLevel}, Topic: ${topic}. Conversation: ${conversationHistory.substring(
              0,
              500
            )}...`,
            parameters: {
              max_length: 200,
              temperature: 0.7,
            },
          }),
        });

        if (response.ok) {
          const result = await response.json();
          aiResponse = service.transform(result);
          console.log(`✅ Successfully used ${service.name} for AI feedback`);
          break;
        }
      } catch (error) {
        console.log(`❌ ${service.name} service failed:`, error);
        continue;
      }
    }

    // If no free AI service worked, use intelligent fallback
    if (!aiResponse) {
      console.log(
        "🔄 All free AI services unavailable, using intelligent fallback"
      );
      return generateIntelligentFeedback(
        messages,
        targetLanguage,
        userLevel,
        topic,
        duration
      );
    }

    // Parse the AI response and create structured feedback
    const feedback = parseAIResponseToFeedback(
      aiResponse,
      targetLanguage,
      userLevel,
      messages
    );

    return feedback;
  } catch (error) {
    console.log(
      "🔄 Error with free AI service, using intelligent fallback:",
      error
    );
    return generateIntelligentFeedback(
      messages,
      targetLanguage,
      userLevel,
      topic,
      duration
    );
  }
};

// Helper function to generate intelligent feedback without external AI
const generateIntelligentFeedback = (
  messages: ConversationMessage[],
  targetLanguage: string,
  userLevel: string,
  topic: string,
  duration: number
): FeedbackResult => {
  const userMessages = messages.filter((msg) => msg.role === "user");
  const assistantMessages = messages.filter((msg) => msg.role === "assistant");
  const messageCount = userMessages.length;
  const avgMessageLength =
    userMessages.reduce((sum, msg) => sum + msg.content.length, 0) /
    Math.max(messageCount, 1);

  // Calculate rating based on comprehensive engagement metrics
  let rating = 2.5; // Base rating

  // Boost rating based on participation and engagement
  if (messageCount >= 3) rating += 0.3;
  if (messageCount >= 5) rating += 0.4;
  if (messageCount >= 8) rating += 0.3;
  if (avgMessageLength > 15) rating += 0.3;
  if (avgMessageLength > 25) rating += 0.2;
  if (duration > 3) rating += 0.2;
  if (duration > 7) rating += 0.2;

  // Analyze conversation quality
  const hasQuestions = userMessages.some((msg) => msg.content.includes("?"));
  const hasLongResponses = userMessages.some((msg) => msg.content.length > 30);
  const hasVariedVocabulary =
    new Set(userMessages.flatMap((msg) => msg.content.toLowerCase().split(" ")))
      .size > 20;

  if (hasQuestions) rating += 0.2;
  if (hasLongResponses) rating += 0.2;
  if (hasVariedVocabulary) rating += 0.2;

  // Cap at 5.0
  rating = Math.min(5.0, rating);

  // Generate contextual feedback based on analysis
  const strengths = [];
  const improvements = [];

  if (messageCount >= 5) {
    strengths.push("Active participation throughout the session");
  }
  if (avgMessageLength > 15) {
    strengths.push("Good response length and engagement");
  }
  if (duration > 3) {
    strengths.push("Sustained conversation effort");
  }
  if (hasQuestions) {
    strengths.push("Good use of questions to engage in conversation");
  }
  if (hasLongResponses) {
    strengths.push("Demonstrated ability to provide detailed responses");
  }
  if (hasVariedVocabulary) {
    strengths.push("Good vocabulary diversity in responses");
  }

  if (messageCount < 3) {
    improvements.push("Try to participate more actively in conversations");
  }
  if (avgMessageLength < 10) {
    improvements.push("Practice forming longer, more detailed responses");
  }
  if (!hasQuestions) {
    improvements.push(
      "Try asking questions to make conversations more interactive"
    );
  }
  if (!hasLongResponses) {
    improvements.push("Work on expanding your responses with more details");
  }

  // Generate level-specific feedback
  const levelSpecificAdvice = getLevelSpecificAdvice(
    userLevel,
    targetLanguage,
    topic
  );

  const feedback = `Great work on your ${targetLanguage} practice session! 🌟

✅ **Strengths:**
${
  strengths.length > 0
    ? strengths.map((s) => `- ${s}`).join("\n")
    : "- Demonstrated commitment to learning\n- Showed willingness to engage with the content"
}

📈 **Areas to continue working on:**
${
  improvements.length > 0
    ? improvements.map((i) => `- ${i}`).join("\n")
    : "- Keep practicing regular conversation to build fluency\n- Focus on expanding your vocabulary in everyday topics"
}

${levelSpecificAdvice}

💡 **Next steps:**
- Try to have longer conversations to build confidence
- Practice with native speakers when possible
- Review vocabulary related to "${topic}" for better preparation
- Consider recording yourself to improve pronunciation

Keep up the excellent work! Every conversation brings you closer to fluency. 💪✨`;

  return { rating, feedback };
};

// Helper function to provide level-specific advice
const getLevelSpecificAdvice = (
  userLevel: string,
  targetLanguage: string,
  topic: string
): string => {
  const levelAdvice = {
    beginner: `🎯 **${
      userLevel.charAt(0).toUpperCase() + userLevel.slice(1)
    } Level Tips:**
- Focus on basic vocabulary and simple sentence structures
- Don't worry about making mistakes - they're part of learning
- Practice common phrases for "${topic}" situations
- Use the target language as much as possible, even if it's just simple words`,

    amateur: `🎯 **${
      userLevel.charAt(0).toUpperCase() + userLevel.slice(1)
    } Level Tips:**
- Work on building more complex sentences
- Practice using different verb tenses when appropriate
- Expand your vocabulary with synonyms and related words
- Try to express opinions and preferences in ${targetLanguage}`,

    intermediate: `🎯 **${
      userLevel.charAt(0).toUpperCase() + userLevel.slice(1)
    } Level Tips:**
- Focus on natural conversation flow and idiomatic expressions
- Practice using conditional sentences and complex structures
- Work on understanding cultural nuances in ${targetLanguage}
- Challenge yourself with more abstract topics beyond "${topic}"`,

    advanced: `🎯 **${
      userLevel.charAt(0).toUpperCase() + userLevel.slice(1)
    } Level Tips:**
- Perfect your pronunciation and accent
- Master subtle grammatical nuances and advanced vocabulary
- Practice debating and expressing complex ideas
- Work on understanding regional dialects and slang in ${targetLanguage}`,
  };

  return (
    levelAdvice[userLevel.toLowerCase() as keyof typeof levelAdvice] ||
    levelAdvice.beginner
  );
};

// Helper function to parse AI response into structured feedback
const parseAIResponseToFeedback = (
  aiResponse: string,
  targetLanguage: string,
  userLevel: string,
  messages: ConversationMessage[]
): FeedbackResult => {
  // Extract rating from AI response or calculate based on content
  let rating = 3.5; // Default rating

  // Simple heuristics to adjust rating based on AI response content
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "well",
    "improved",
    "progress",
  ];
  const negativeWords = ["needs", "improve", "practice", "work on", "struggle"];

  const responseLower = aiResponse.toLowerCase();
  const positiveCount = positiveWords.filter((word) =>
    responseLower.includes(word)
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    responseLower.includes(word)
  ).length;

  if (positiveCount > negativeCount) rating += 0.5;
  if (negativeCount > positiveCount) rating -= 0.5;

  // Ensure rating is within bounds
  rating = Math.max(1.0, Math.min(5.0, rating));

  // Use AI response as feedback, or fallback to intelligent feedback
  const feedback =
    aiResponse.trim() ||
    generateIntelligentFeedback(messages, targetLanguage, userLevel, "", 0)
      .feedback;

  return { rating, feedback };
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
