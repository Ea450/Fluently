import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface FeedbackResult {
  rating: number;
  feedback: string;
}

export const generateAIFeedback = async (
  messages: ConversationMessage[],
  targetLanguage: string,
  userLevel: string,
  topic: string,
  duration: number
): Promise<FeedbackResult | null> => {
  try {
    // Filter out system messages and prepare conversation history
    const conversationHistory = messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional language learning evaluator. Provide constructive, encouraging feedback based on conversation analysis. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      console.error("❌ No response from OpenAI");
      return null;
    }

    // Parse the JSON response
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
        console.error("❌ Invalid feedback format from AI:", parsed);
        return null;
      }
    } catch (parseError) {
      console.error("❌ Failed to parse AI feedback JSON:", parseError);
      console.error("❌ Raw response:", response);
      return null;
    }

  } catch (error) {
    console.error("❌ Error generating AI feedback:", error);
    return null;
  }
};

// Fallback feedback generator in case AI service fails
export const generateFallbackFeedback = (
  targetLanguage: string,
  userLevel: string,
  messageCount: number
): FeedbackResult => {
  const rating = Math.min(4.5, 2.5 + (messageCount * 0.1));
  
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