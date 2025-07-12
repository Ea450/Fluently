"use client";
import { languages } from "@/constant/data";
import { useState } from "react";

const TTSSpeaker = ({ setSpeech }: { setSpeech: (v: boolean) => void }) => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");

  const speak = async () => {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });

    const audioBlob = await res.blob();
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    audio.play();
  };

  return (
    <div className="p-4 space-y-4 border mt-10 rounded-2xl text-center relative">
      <button
        onClick={() => setSpeech(false)}
        className="text-gray-500 hover:text-red-800 dark:hover:text-red-950 cursor-pointer absolute top-4 right-4"
      >
        Close ❌
      </button>

      <textarea
        className="w-full border p-2 rounded-2xl mt-10 resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak..."
      />
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={speak}
          className="button"
        >
          Generate Speech
        </button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="button"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TTSSpeaker;
