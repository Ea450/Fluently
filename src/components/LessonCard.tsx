"use client";

import Link from "next/link";

export default function LessonCard({
  id,
  language,
  rate,
  level,
}: LessonCardProps) {
  return (
    <Link
      href={`/lessons/${id}`}
      className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-4 w-full"
    >
      <h2 className="text-xl font-semibold mb-2">
        {language} <span className="text-sm font-extralight">({level})</span>
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${rate * 100}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Lesson rate is {Math.floor(rate * 100)}%{" "}
      </p>
    </Link>
  );
}
