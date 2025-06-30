import LessonCard from "@/components/LessonCard"
import UserSection from "@/components/UserSection"
import { lessons } from "@/constant/data"

const Lessons = () => {
    return (
        <div className="p-6 sm:p-8 bg-gray-50 dark:bg-[#111827] min-h-screen">
            <UserSection />
            <section>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Here you can find all your lessons. Click on a lesson to start learning!
                </p>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">📚 Your Lessons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <LessonCard key={lesson.id} {...lesson} />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Lessons