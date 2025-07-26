"use client";
import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

const AIConversation = ({
  target_language,
  user_level,
  topic,
}: AIConversationProps) => {
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISATANT_ID!;
  const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY!;

  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<
    Array<{ role: string; text: string }>
  >([]);
  const vapiRef = useRef<any>(null); // <-- useRef for Vapi instance

  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => setIsConnected(true));
    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });
    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        setTranscript((prev) => [
          ...prev,
          { role: message.role, text: message.transcript },
        ]);
      }
    });
    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
    });

    return () => {
      vapi.stop();
    };
  }, [apiKey]);

  const startCall = () => {
    if (vapiRef.current) {
      vapiRef.current.start(assistantId, {
        variableValues: { target_language, user_level, topic },
      });
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] font-sans">
      {!isConnected ? (
        <button
          onClick={startCall}
          className="bg-teal-600 text-white border-none rounded-full px-6 py-4 text-base font-bold cursor-pointer shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          🎤 Talk to Assistant
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-5 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSpeaking ? "bg-red-500 animate-pulse" : "bg-teal-600"
                }`}
              ></div>
              <span className="font-semibold text-gray-800">
                {isSpeaking ? "Assistant Speaking..." : "Listening..."}
              </span>
            </div>
            <button
              onClick={endCall}
              className="bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-600 transition cursor-pointer"
            >
              End Call
            </button>
          </div>

          <div className="max-h-52 overflow-y-auto mb-3 p-2 bg-gray-100 rounded-md space-y-2">
            {transcript.length === 0 ? (
              <p className="text-sm text-gray-500 m-0">
                Conversation will appear here...
              </p>
            ) : (
              transcript.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`text-white px-3 py-2 rounded-xl text-sm max-w-[80%] ${
                      msg.role === "user" ? "bg-teal-600" : "bg-gray-800"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIConversation;
