"use client";

import { useState } from "react";
import { saveRateAndFeedback } from "@/lib/actions/languages";
import { toast } from "sonner";

interface ManualFeedbackFormProps {
  lessons: { id: string; language: string; level: string; topic: string }[];
  onFeedbackSubmitted: () => void;
}

const ManualFeedbackForm = ({ lessons, onFeedbackSubmitted }: ManualFeedbackFormProps) => {
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLessonId || rating === 0 || !feedback.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveRateAndFeedback(selectedLessonId, rating / 5, feedback);
      toast.success("Feedback submitted successfully!");
      
      // Reset form
      setSelectedLessonId("");
      setRating(0);
      setFeedback("");
      
      // Notify parent to refresh data
      onFeedbackSubmitted();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLesson = lessons.find(lesson => lesson.id === selectedLessonId);

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        ✍️ Add Manual Feedback
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lesson Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Lesson
          </label>
          <select
            value={selectedLessonId}
            onChange={(e) => setSelectedLessonId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a lesson...</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.language} - {lesson.topic} ({lesson.level})
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating ({rating}/5)
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                } hover:text-yellow-400`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts about this lesson..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Preview */}
        {selectedLesson && rating > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview:
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>{selectedLesson.language} - {selectedLesson.topic}</strong> ({selectedLesson.level})
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-semibold text-blue-600">{Math.round((rating / 5) * 100)}%</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xs ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !selectedLessonId || rating === 0 || !feedback.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default ManualFeedbackForm;