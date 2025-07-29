"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { languages, levels, topics } from "@/constant/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { CreateLesson, createQuiz } from "@/lib/actions/languages";

const formSchema = z.object({
  language: z.string().min(1, { message: "Language is required" }),
  topic: z.string().optional(),
  level: z.string().min(1, { message: "Level is required" }),
  duration: z.string().optional(),
});

const FormOptions = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // ...
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "",
      topic: "",
      level: "",
      duration: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (pathname === "/practice") {
      await createQuiz(values);
      redirect("/practice/quiz");
    } else {
      if (pathname === "/createLesson") {
        const lesson = await CreateLesson(
          values.language,
          values.level,
          values.topic!,
          +values.duration!
        );
        if (lesson) {
          redirect(`lessons/${lesson.id}`);
        }
      }
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 "
      >
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input capitalize">
                    <SelectValue placeholder="Select the Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem
                        value={language.label}
                        key={language.label}
                        className="capitalize"
                      >
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {pathname === "/createLesson" && (
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="input capitalize">
                      <SelectValue placeholder="Select the Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem
                          value={topic.title}
                          key={topic.title}
                          className="capitalize"
                        >
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input capitalize">
                    <SelectValue placeholder="Select the Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem
                        value={level}
                        key={level}
                        className="capitalize"
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {pathname === "/createLesson" && (
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated session duration in minutes</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    {...field}
                    className="input"
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading
            ? "Loading..."
            : pathname === "/createLesson"
            ? "Create Lesson"
            : "Start Quiz"}
        </Button>
      </form>
    </Form>
  );
};
export default FormOptions;
