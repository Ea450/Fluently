'use client';
import { useState, useEffect } from 'react';

export default function HandleSpeaking({ setSpeaking }: { setSpeaking: (v: boolean) => void }) {
  const [text, setText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  // Automatically start conversation with a greeting from AI
  useEffect(() => {
    if (messages.length === 0) {
      (async () => {
        const res = await fetch('/api/conversation', {
          method: 'POST',
          body: JSON.stringify({ message: "Hello!", session_id: sessionId }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setSessionId(data.session_id);
        setMessages([{ role: 'ai', text: data.text }]);
        if (data.audio) {
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
          audio.play();
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);

    const res = await fetch('/api/conversation', {
      method: 'POST',
      body: JSON.stringify({ message: text, session_id: sessionId }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    setSessionId(data.session_id);
    setMessages((prev) => [...prev, { role: 'ai', text: data.text }]);

    if (data.audio) {
      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
      audio.play();
    } else {
      console.error('No audio data received from the server.');
    }

    setText('');
  };

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-800 rounded shadow-lg fixed inset-0 z-50 flex flex-col">
      <button
        onClick={() => setSpeaking(false)}
        className="self-end text-gray-500 hover:text-gray-800 dark:hover:text-white"
      >
        Close ✖
      </button>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto flex-1">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Ask the AI..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}