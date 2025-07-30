"use client";

interface FeedbackAnalyticsProps {
  analytics: FeedbackAnalytics;
}

const FeedbackAnalytics = ({ analytics }: FeedbackAnalyticsProps) => {
  const { totalLessons, averageRating, languageStats } = analytics;
  
  // Convert average rating to percentage and stars
  const averagePercentage = Math.round(averageRating * 100);
  const averageStars = Math.round(averageRating * 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overall Stats */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            📈 Overall Progress
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{totalLessons}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Lessons Completed</p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl font-bold text-green-600">{averagePercentage}%</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < averageStars ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600 mt-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${averagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Breakdown */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          🌍 Progress by Language
        </h3>
        
        {languageStats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No language data available yet
          </p>
        ) : (
          <div className="space-y-4">
            {languageStats.map((lang) => {
              const langPercentage = Math.round(lang.averageRating * 100);
              const langStars = Math.round(lang.averageRating * 5);
              
              return (
                <div key={lang.language} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {lang.language}
                      </h4>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        {lang.count} lesson{lang.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-blue-600">
                        {langPercentage}%
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < langStars ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${langPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackAnalytics;