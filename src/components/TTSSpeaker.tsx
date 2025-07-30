"use client";
import { useState } from "react";
import { languages } from "@/constant/data";

const TTSSpeaker = ({ setSpeech }: { setSpeech: (v: boolean) => void }) => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");

  const speak = (text: string, langCode: string) => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;

    const voices = speechSynthesis.getVoices();
    const matchedVoice = voices.find((voice) =>
      voice.lang.startsWith(langCode)
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      speechSynthesis.speak(utterance);
    } else {
      alert(
        `No voice found for "${langCode}". Please install an Arabic voice or try a different language.`
      );
    }
  };

  return (
    <div className="p-4 space-y-4 border mt-10 rounded-2xl text-center relative">
      <h2>🔊 Voice Speaker</h2>
      <button
        onClick={() => setSpeech(false)}
        className="text-gray-500 hover:text-red-800 dark:hover:text-red-950 cursor-pointer absolute top-4 right-4"
      >
        Close ❌
      </button>

      <textarea
        className="w-full border p-2 rounded-2xl mt-10 resize-none"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak..."
      />

      <div className="flex items-center justify-center gap-6">
        <button onClick={() => speak(text, language)} className="button">
          🔈 Speak
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
