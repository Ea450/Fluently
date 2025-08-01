"use client";

import { saveRateAndFeedback } from "@/lib/actions/languages";
import { vapi } from "@/lib/actions/vapi.sdk";
import {
  cn,
  configureAssistant,
  formatTime,
  generateAIFeedback,
  generateFallbackFeedback,
} from "@/lib/utils";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const AIConversation = ({
  target_language,
  user_level,
  topic,
  duration,
  userName,
  userImage,
  lessonId,
}: AIConversationProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [remainingTime, setRemainingTime] = useState(duration * 60);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          handleDisconnect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const toggleMicrophone = () => {
    const isCurrentlyMuted = vapi.isMuted();
    vapi.setMuted(!isCurrentlyMuted);
    setIsMuted(!isCurrentlyMuted);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    const assistantOverrides = {
      variableValues: { target_language, topic, user_level, duration },
      clientMessages: ["transcript"],
      serverMessages: [],
    };
    // @ts-expect-error - Vapi start method typing issue with assistant overrides
    vapi.start(configureAssistant(), assistantOverrides);
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
    stopCountdown();

    // Generate AI feedback based on the entire conversation
    try {
      console.log("🤖 Generating AI feedback...");

      const aiResult = await generateAIFeedback(
        messages,
        target_language,
        user_level,
        topic,
        duration
      );

      let feedbackResult = aiResult;

      // Use fallback if AI feedback generation fails
      if (!feedbackResult) {
        console.warn("⚠️ AI feedback failed, using fallback feedback");
        feedbackResult = generateFallbackFeedback(
          target_language,
          user_level,
          messages.filter((msg) => msg.role === "user").length
        );
      }

      if (feedbackResult?.rating && feedbackResult?.feedback) {
        await saveRateAndFeedback(
          lessonId,
          feedbackResult.rating,
          feedbackResult.feedback
        );
        console.log("✅ AI-generated feedback saved to Supabase");
      }
    } catch (err) {
      console.error("❌ Failed to generate/save AI feedback:", err);

      // Use fallback feedback on error
      try {
        const fallbackResult = generateFallbackFeedback(
          target_language,
          user_level,
          messages.filter((msg) => msg.role === "user").length
        );
        await saveRateAndFeedback(
          lessonId,
          fallbackResult.rating,
          fallbackResult.feedback
        );
        console.log("✅ Fallback feedback saved to Supabase");
      } catch (fallbackErr) {
        console.error("❌ Failed to save fallback feedback:", fallbackErr);
      }
    }
  };

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setRemainingTime(duration * 60);
      startCountdown();
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      stopCountdown();
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onError = (error: Error) => console.log("error", error);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      stopCountdown();
    };
  }, [lessonId]);

  return (
    <main className="flex flex-col h-[90vh]">
      <section className="flex gap-8 max-sm:flex-col">
        <section className="relative w-full max-w-2xl mx-auto pt-10 px-4 pb-10 overflow-hidden rounded-lg border-2 border-black">
          <div
            className="overflow-y-auto max-h-[40vh] no-scrollbar space-y-4 px-2"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm sm:text-base max-w-[80%] whitespace-pre-wrap 
                      ${
                        isUser
                          ? "bg-gray-500 text-white rounded-br-none"
                          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                      }
                    `}
                  >
                    <span className="font-semibold">
                      {isUser ? userName : "MR"}
                    </span>
                    : {message.content}
                  </div>
                </div>
              );
            })}
          </div>
          {callStatus === CallStatus.ACTIVE && (
            <div className="text-xl font-mono text-green-600 absolute bottom-2 right-2">
              ⏳ Remaining Time: {formatTime(remainingTime)}
            </div>
          )}
        </section>

        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName || "user"}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="font-bold text-2xl">{userName}</p>
          </div>

          <button
            className="btn-mic"
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? "/images/mic-off.svg" : "/images/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>

          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white dark:bg-blue-600",
              callStatus === CallStatus.ACTIVE
                ? "dark:bg-red-700 bg-red-600"
                : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Session"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting"
              : "Start Session"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default AIConversation;
