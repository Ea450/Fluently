"use client";
import { useState } from "react";
import { languages } from "@/constant/data";

const VOICERSS_API_KEY = process.env.NEXT_PUBLIC_VOICERSS_API_KEY!;

const TTSSpeaker = ({ setSpeech }: { setSpeech: (v: boolean) => void }) => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");

  const speakWithVoiceRSS = async (text: string, langCode: string) => {
    try {
      const url = `https://api.voicerss.org/?key=${VOICERSS_API_KEY}&hl=${langCode}&src=${encodeURIComponent(
        text
      )}&c=MP3&f=44khz_16bit_stereo`;

      const response = await fetch(url);
      const audioBlob = await response.blob();

      if (audioBlob.type !== "audio/mpeg") {
        throw new Error("Invalid audio format returned");
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      alert("Text-to-speech failed. Please check the language or API key.");
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
        <button
          onClick={() => speakWithVoiceRSS(text, language)}
          className="button"
        >
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
