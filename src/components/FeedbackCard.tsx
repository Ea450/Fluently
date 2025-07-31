"use client";

interface FeedbackCardProps {
  feedback: FeedbackItem;
}

const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  const { language, level, topic, rate, feedback: feedbackText, created_at } = feedback;
  
  // Convert rate (0-1) to percentage and stars
  const percentage = Math.round(rate * 100);
  const stars = Math.round(rate * 5);
  
  // Simple date formatting
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {language} - {topic}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
            {level}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(created_at)}
        </span>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < stars ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Feedback Text */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🤖</span>
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
            AI Tutor Feedback
          </h4>
          <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full">
            Auto-generated
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {feedbackText}
        </p>
      </div>
    </div>
  );
};

export default FeedbackCard;