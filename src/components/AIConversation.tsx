"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback } from "react";

export default function AIConversation() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });
  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch("/api/conversation");
    if (!response.ok) {
      throw new Error(`Failed to get signed url: ${response.statusText}`);
    }
    const { signedUrl } = await response.json();
    return signedUrl;
  };
  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const signedUrl = await getSignedUrl(); // Use it here

      await conversation.startSession({
        signedUrl,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div>
      <div>
        <button
          onClick={startConversation}
          disabled={conversation.status === "connected"}
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
        >
          Stop Conversation
        </button>
      </div>

      <div>
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>
    </div>
  );
}
