"use client";

import Link from "next/link";

export default function LessonCard({
  id,
  language,
  rate,
  level,
}: LessonCardProps) {
  const percentage = Math.floor(rate * 100);
  const stars = Math.round(rate * 5);
  
  const getRatingColor = (rating: number) => {
    if (rating >= 0.8) return "from-green-500 to-emerald-500";
    if (rating >= 0.6) return "from-blue-500 to-cyan-500";
    if (rating >= 0.4) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 0.8) return { text: "Excellent", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" };
    if (rating >= 0.6) return { text: "Good", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" };
    if (rating >= 0.4) return { text: "Average", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" };
    return { text: "Needs Practice", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" };
  };

  const badge = getRatingBadge(rate);

  return (
    <Link
      href={`/lessons/${id}`}
      className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-4 w-full hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold">
          {language} <span className="text-sm font-extralight">({level})</span>
        </h2>
        <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
          {badge.text}
        </span>
      </div>
      
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < stars ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
              }`}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600 mb-2">
        <div
          className={`bg-gradient-to-r ${getRatingColor(rate)} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Performance Rating: {percentage}%
      </p>
    </Link>
  );
}
