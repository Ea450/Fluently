"use client";
import { saveRateAndFeedback } from "@/lib/actions/languages";
import { vapi } from "@/lib/actions/vapi.sdk";
import { cn, configureAssistant, extractFeedback } from "@/lib/utils";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useState, useEffect, useRef } from "react";
import soundwaves from "@/constant/soundwaves.json";
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
  userName,
  userImage,
  lessonId,
}: AIConversationProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  //handle toggle user microphone
  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  // handle start call and reseve messages
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    const assistantOverrides = {
      variableValues: { target_language, topic, user_level },
      clientMessages: ["transcript"],
      serverMessages: [],
    };
    // @ts-expect-error
    vapi.start(configureAssistant(), assistantOverrides);
  };

  // handle finishing call and save feedback and rating
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    const lastMessage = messages[messages.length - 1];
    const result = extractFeedback(lastMessage.content);
    if (result?.rating && result?.feedback) {
      await saveRateAndFeedback(lessonId, result.rating, result.feedback);
    }
    vapi.stop();
  };

  // lottie animation for sound waves
  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking, lottieRef]);

  // handle vapi events
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };
    const onCallEnd = async () => {
      setCallStatus(CallStatus.FINISHED);
      const lastMessage = messages[messages.length - 1];
      const result = extractFeedback(lastMessage.content);
      if (result?.rating && result?.feedback) {
        await saveRateAndFeedback(lessonId, result.rating, result.feedback);
      }
    };

    const onError = (error: Error) => console.log("error", error);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("error", onError);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("error", onError);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, [lessonId]);

  return (
    <section className="flex flex-col h-[90vh]">
      <section className="flex gap-8 max-sm:flex-col ">
        <section
          className="relative flex flex-col gap-4 w-full items-center pt-10 overflow-hidden border-2 border-black
    h-5"
        >
          <div className="transcript-message no-scrollbar">
            {messages.map((message, index) => {
              if (message.role === "assistant") {
                return (
                  <p key={index} className="max-sm:text-sm">
                    MR : {message.content}
                  </p>
                );
              } else {
                return (
                  <p key={index} className="text-primary max-sm:text-sm">
                    {userName}: {message.content}
                  </p>
                );
              }
            })}
          </div>
          <div className="transcript-fade" />
        </section>
        <div className="user-section ">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
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
    </section>
  );
};

export default AIConversation;
