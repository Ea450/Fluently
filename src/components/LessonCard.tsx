"use client";

import Link from "next/link";

export default function LessonCard({
  id,
  language,
  rate,
  level,
}: LessonCardProps) {
  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-4 w-full">
      <h2 className="text-xl font-semibold mb-2">
        {language} <span className="text-sm font-extralight">({level})</span>
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${rate * 2 * 10}%` }}
        ></div>
      </div>
      <div className="flex mt-4 justify-evenly gap-1">
        <Link
          href={`/lessons/${id}`}
          className="dark:bg-blue-600 text-white px-2 py-1 rounded cursor-pointer bg-stone-900 mt-2 text-center sm:text-sm md:text-base"
        >
          Get Lesson
        </Link>
        <Link
          href={`/lessons/feedback/${id}`}
          className="dark:bg-blue-600 text-white px-2 py-1 rounded cursor-pointer bg-stone-900 mt-2 text-center sm:text-sm md:text-base"
        >
          Check Feedback
        </Link>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Lesson rate is {Math.floor(rate * 2 * 10)}%{" "}
      </p>
    </div>
  );
}
