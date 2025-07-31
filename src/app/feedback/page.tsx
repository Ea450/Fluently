"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserFeedback, getUserFeedbackAnalytics } from "@/lib/actions/languages";
import UserSection from "@/components/UserSection";
import FeedbackCard from "@/components/FeedbackCard";
import FeedbackAnalytics from "@/components/FeedbackAnalytics";
import FeedbackDebug from "@/components/FeedbackDebug";

const FeedbackPage = () => {
  const { userId, isLoaded } = useAuth();
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [analytics, setAnalytics] = useState<FeedbackAnalytics>({
    totalLessons: 0,
    averageRating: 0,
    languageStats: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !userId) {
      redirect("/sign-in");
    }
  }, [isLoaded, userId]);

  const fetchData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const [feedbackResult, analyticsResult] = await Promise.all([
        getUserFeedback(userId),
        getUserFeedbackAnalytics(userId)
      ]);
      
      setFeedbackData(feedbackResult);
      setAnalytics(analyticsResult);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const refreshData = () => {
    fetchData(); // Refresh all data
  };

  const exportFeedback = () => {
    const csvContent = [
      ["Language", "Level", "Topic", "Rating %", "Stars", "Feedback", "Date"].join(","),
      ...feedbackData.map(item => [
        item.language,
        item.level,
        item.topic,
        Math.round(item.rate * 100),
        Math.round(item.rate * 5),
        `"${item.feedback.replace(/"/g, '""')}"`, // Escape quotes in CSV
        new Date(item.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fluently-feedback-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isLoaded || isLoading) {
    return (
      <main className="h-[90vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your feedback...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[90vh]">
      <UserSection />
      
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🤖 AI-Generated Learning Feedback
        </h1>
        <div className="flex gap-3">
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🔄 Refresh
          </button>
          {feedbackData.length > 0 && (
            <button
              onClick={exportFeedback}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              📤 Export CSV
            </button>
          )}
                </div>
      </div>

      {/* Debug Section - Remove in production */}
      <section className="mb-8">
        <FeedbackDebug />
      </section>
        
      {/* Analytics Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          📈 Your Learning Analytics
        </h2>
        <FeedbackAnalytics analytics={analytics} />
      </section>

      {/* Feedback Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            💬 Your Lesson Feedback
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {feedbackData.length} feedback{feedbackData.length !== 1 ? 's' : ''} found
          </span>
        </div>
        
        {feedbackData.length === 0 ? (
          <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-8 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No AI feedback yet!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              Complete some lessons with AI conversations to receive personalized feedback and see your progress here.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>How it works:</strong> After each lesson, our AI tutor automatically analyzes your performance and provides detailed feedback including strengths, areas for improvement, and next steps.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {feedbackData.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default FeedbackPage;