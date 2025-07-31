"use client";

import { useState } from "react";
import { extractFeedback, generateFallbackFeedback } from "@/lib/utils";

const FeedbackDebug = () => {
  const [testMessage, setTestMessage] = useState(`Great conversation practice! 

You did really well today with your Spanish lesson. Your pronunciation has improved and you're using more varied vocabulary.

\`\`\`json
{
  "rating": 4.2,
  "feedback": "🌟 Excellent conversation practice!\\n\\n✅ Strengths:\\n• Used past tense correctly in 'Fui al mercado'\\n• Great vocabulary variety with words like 'delicioso' and 'caro'\\n• Natural pronunciation of difficult sounds\\n\\n❗ Areas to improve:\\n• Verb agreement: 'Ellos era' should be 'Ellos eran'\\n• Try using more connecting words like 'sin embargo', 'porque'\\n\\n📘 Next steps:\\n• Practice irregular verbs for 10 minutes daily\\n• Try describing your daily routine in Spanish\\n\\nYou're improving rapidly - keep up the fantastic work! 🎉"
}
\`\`\``);
  
  const [extractedFeedback, setExtractedFeedback] = useState<any>(null);
  const [fallbackFeedback, setFallbackFeedback] = useState<any>(null);

  const testExtraction = () => {
    const result = extractFeedback(testMessage);
    setExtractedFeedback(result);
  };

  const testFallback = () => {
    const result = generateFallbackFeedback(5);
    setFallbackFeedback(result);
  };

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        🔧 AI Feedback Debug Tool
      </h3>
      
      {/* Test Message Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test AI Message:
        </label>
        <textarea
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
        />
      </div>

      {/* Test Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={testExtraction}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Test Extraction
        </button>
        <button
          onClick={testFallback}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Test Fallback
        </button>
      </div>

      {/* Results */}
      {extractedFeedback && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            ✅ Extracted Feedback:
          </h4>
          <pre className="text-xs text-blue-600 dark:text-blue-400 whitespace-pre-wrap">
            {JSON.stringify(extractedFeedback, null, 2)}
          </pre>
        </div>
      )}

      {fallbackFeedback && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
            🔄 Fallback Feedback:
          </h4>
          <pre className="text-xs text-green-600 dark:text-green-400 whitespace-pre-wrap">
            {JSON.stringify(fallbackFeedback, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
          💡 How AI Feedback Works:
        </h4>
        <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
          <li>• AI tutor provides feedback at the end of each conversation</li>
          <li>• Feedback includes rating (1-5) and detailed text analysis</li>
          <li>• System looks for JSON format in AI responses</li>
          <li>• If no structured feedback found, generates fallback feedback</li>
          <li>• All feedback is automatically saved to your progress</li>
        </ul>
      </div>
    </div>
  );
};

export default FeedbackDebug;