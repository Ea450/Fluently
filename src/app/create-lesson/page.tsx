import FormOptions from "@/components/FormOptions";
const CreateLesson = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-[#1F2937] rounded-2xl shadow flex flex-col gap-6 container mt-20">
      <h2 className="text-center text-2xl">Start Lesson</h2>
      <FormOptions />
    </div>
  );
};

export default CreateLesson;
