import UserSection from '@/components/UserSection'
import React from 'react'

const Practice = () => {
    return (
        <section className="p-6 sm:p-8 bg-gray-50 dark:bg-[#111827] min-h-screen">
            <UserSection />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">🎯 Practice</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
                    <h3 className="text-xl font-semibold mb-2">🔊 Listening</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Improve your listening with native voices.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Start Listening
                    </button>
                </div>
                <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
                    <h3 className="text-xl font-semibold mb-2">🗣️ Speaking</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Practice your pronunciation and speaking.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Start Speaking
                    </button>
                </div>
                <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow p-6 flex flex-col items-start">
                    <h3 className="text-xl font-semibold mb-2">🧠 Quiz</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Test your knowledge with quick quizzes.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Start Quiz
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Practice