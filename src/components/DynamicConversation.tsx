'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { getConversation } from '@/lib/actions/languages';

export default function DynamicConversation() {
    const searchParams = useSearchParams();
    const language_id = searchParams.get('language');
    const topic_id = searchParams.get('topic');

    const [conversation, setConversation] = useState<any[]>([]);
    const [current, setCurrent] = useState(0);
    const [speaking, setSpeaking] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (language_id && topic_id) {
                const data = await getConversation(language_id, topic_id);
                setConversation(data);
            }
        };
        load();
    }, [language_id, topic_id]);

    const handleSpeak = () => {
        const utter = new SpeechSynthesisUtterance(conversation[current].prompt_text);
        utter.lang = 'es'; // Dynamically adjust this
        utter.onstart = () => setSpeaking(true);
        utter.onend = () => setSpeaking(false);
        speechSynthesis.speak(utter);
    };

    if (!conversation.length) return <div>Loading conversation...</div>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Conversation</h2>

            <div className="text-xl">{conversation[current].prompt_text}</div>

            <div className="flex gap-3">
                <Button onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}>
                    ◀ Back
                </Button>
                <Button onClick={handleSpeak} disabled={speaking}>
                    {speaking ? '🔊 Speaking...' : '🔊 Speak'}
                </Button>
                <Button
                    onClick={() =>
                        setCurrent((prev) =>
                            Math.min(prev + 1, conversation.length - 1)
                        )
                    }
                >
                    Next ▶
                </Button>
            </div>
        </div>
    );
}
