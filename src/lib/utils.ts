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
🏁 CRITICAL - Session Ending Protocol:
When the conversation is ending (time up, user says goodbye, or natural conclusion):

1. **ALWAYS** provide comprehensive feedback in the format below
2. **NEVER** skip this step - feedback is mandatory
3. **ALWAYS** end your response with the JSON structure

**Feedback Structure:**
1. Start with warm congratulations
2. List **2-3 specific strengths** with examples from the conversation
3. Mention **1-2 areas for improvement** with constructive suggestions
4. Provide **concrete next steps** for practice
5. End with strong encouragement

**MANDATORY JSON OUTPUT:**
You MUST end every session with this exact JSON format:

```json
{
  "rating": [number between 1.0-5.0 based on performance],
  "feedback": "[Detailed feedback text with ✅ Strengths, ❗ Areas to improve, 📘 Next steps, and encouragement]"
}
```

**Example:**
```json
{
  "rating": 4.2,
  "feedback": "🌟 Excellent conversation practice!\n\n✅ Strengths:\n• Used past tense correctly in 'I went to the market'\n• Great vocabulary variety with words like 'delicious' and 'expensive'\n• Natural pronunciation of difficult sounds\n\n❗ Areas to improve:\n• Verb agreement: 'They was' should be 'They were'\n• Try using more connecting words like 'however', 'because'\n\n📘 Next steps:\n• Practice irregular verbs for 10 minutes daily\n• Try describing your daily routine in {{target_language}}\n\nYou're improving rapidly - keep up the fantastic work! 🎉"
}
```

**REMEMBER:** Always include this JSON at the very end of your final message!

`,
        },
      ],
    },
  };
  return vapiAssistant;
};
export const extractFeedback = (message: string) => {
  try {
    // Try multiple patterns to extract JSON feedback
    let jsonString = null;
    
    // Pattern 1: ```json ... ```
    let jsonMatch = message.match(/```json([\s\S]*?)```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1]?.trim();
    }
    
    // Pattern 2: { ... } at the end of message
    if (!jsonString) {
      const lastBraceMatch = message.match(/\{[^}]*"rating"[^}]*"feedback"[^}]*\}/);
      if (lastBraceMatch) {
        jsonString = lastBraceMatch[0];
      }
    }
    
    // Pattern 3: Find any JSON object with rating and feedback
    if (!jsonString) {
      const generalMatch = message.match(/\{[\s\S]*?"rating"[\s\S]*?"feedback"[\s\S]*?\}/);
      if (generalMatch) {
        jsonString = generalMatch[0];
      }
    }

    if (!jsonString) {
      console.warn("⚠️ No JSON feedback found in message");
      return null;
    }

    const parsed = JSON.parse(jsonString);

    // Validate the structure
    if (
      typeof parsed.rating === "number" &&
      typeof parsed.feedback === "string" &&
      parsed.rating >= 1.0 &&
      parsed.rating <= 5.0
    ) {
      console.log("✅ Successfully extracted AI feedback:", { 
        rating: parsed.rating, 
        feedbackLength: parsed.feedback.length 
      });
      return {
        rating: Number((parsed.rating / 5).toFixed(2)), // Convert to 0-1 scale for storage
        feedback: parsed.feedback
      };
    }

    console.warn("⚠️ Invalid feedback structure:", parsed);
    return null;
  } catch (err) {
    console.error("❌ Failed to parse feedback JSON:", err);
    console.error("Message content:", message.substring(0, 200) + "...");
    return null;
  }
};

// Generate fallback feedback if AI doesn't provide structured feedback
export const generateFallbackFeedback = (conversationLength: number = 0) => {
  const ratings = [3.5, 4.0, 4.2, 3.8, 4.5];
  const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
  
  const feedbacks = [
    "Great conversation practice! 🌟\n\n✅ Strengths:\n• Good effort in using the target language\n• Showed willingness to practice and learn\n\n❗ Areas to improve:\n• Continue practicing regularly for better fluency\n• Try expanding your vocabulary\n\n📘 Next steps:\n• Practice speaking for 10-15 minutes daily\n• Focus on common conversation topics\n\nKeep up the good work! 🎉",
    
    "Nice practice session! 👏\n\n✅ Strengths:\n• Engaged well in conversation\n• Made good attempts at communication\n\n❗ Areas to improve:\n• Work on pronunciation and clarity\n• Try using more varied sentence structures\n\n📘 Next steps:\n• Practice with native audio content\n• Focus on rhythm and intonation\n\nYou're making progress! 💪",
    
    "Well done on your lesson! 🎯\n\n✅ Strengths:\n• Participated actively in the conversation\n• Showed good learning attitude\n\n❗ Areas to improve:\n• Build confidence in speaking\n• Expand your active vocabulary\n\n📘 Next steps:\n• Try speaking about different topics\n• Practice common phrases daily\n\nGreat effort today! 🌟"
  ];
  
  const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
  
  return {
    rating: randomRating / 5, // Convert to 0-1 scale
    feedback: randomFeedback
  };
};
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};
