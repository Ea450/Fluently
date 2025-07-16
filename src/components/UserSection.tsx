"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const UserSection = () => {
  const { user } = useUser();
  return (
    <div className="mb-6 p-2 sm:p-6 bg-white dark:bg-[#1F2937] rounded-2xl shadow flex items-center text-center justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Image
            src={user?.imageUrl || "/images/avatar.png"}
            alt="User Avatar"
            width={50}
            height={50}
            className="rounded-full mb-2"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Welcome {user?.firstName}👋
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Continue learning and improve your skills.
        </p>
      </div>
      <div className="border p-2 rounded-lg bg-gray-50 dark:bg-[#111827] text-sm">
        <Link href="/createLesson">+ Create Lesson</Link>
      </div>
    </div>
  );
};

export default UserSection;
