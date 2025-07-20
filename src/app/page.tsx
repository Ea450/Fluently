import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
  const user = await auth();
  if (user.isAuthenticated) redirect("/dashboard");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Image
        src="/images/logo.png"
        alt="Fluently Logo"
        width={150}
        height={150}
        className="mb-6"
      />
      <div>
        <h1 className="text-center font-bold text-3xl">Welcome to Fluently</h1>
        <p className="text-gray-700 dark:text-gray-300 text-center mt-4 px-4">
          AI-Powered Language Learning Platform to help you learn languages
          fluently. With Fluently, you can immerse yourself in a new language
          through personalized lessons, interactive exercises, and real-world
          conversations. Whether you&apos;re a beginner or looking to improve
          your skills, Fluently adapts to your learning style and pace. choose a
          language and start your journey today! make learning languages fun and
          engaging with our interactive lessons and exercises.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="mt-8 px-6 py-3 dark:bg-blue-600 text-white rounded-lg dark:hover:bg-blue-700 transition-colors bg-cyan-950 hover:bg-cyan-800"
      >
        Lets Get Started
      </Link>
    </div>
  );
};

export default Home;
