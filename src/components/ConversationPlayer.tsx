'use client';

import { useEffect, useState } from 'react';
import TTSButton from './TTSButton';
import VoiceInput from './VoiceInput';
import { Button } from '@/components/ui/button';
import { getConversation } from '@/lib/actions/languages';

export default function ConversationPlayer({
    language_id,
    id,
    langCode,
}: {
    language_id: string;
    id: string;
    langCode: string;
}) {
    const [conversation, setConversation] = useState<any[]>([]);
    const [current, setCurrent] = useState(0);
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        const load = async () => {
            const data = await getConversation(language_id, id);
            setConversation(data);
        };
        load();
    }, [language_id, id]);

    const handleNext = () => {
        setUserInput('');
        if (current < conversation.length - 1) {
            setCurrent(current + 1);
        }
    };

    const handleCheck = () => {
        const expected = conversation[current]?.expected_response?.toLowerCase();
        const user = userInput.toLowerCase();
        if (expected) {
            if (user.includes(expected)) {
                alert('✅ Correct!');
            } else {
                alert(`❌ Try again.\nExpected: ${expected}`);
            }
        } else {
            alert('✅ Response received!');
        }
        handleNext();
    };

    if (!conversation.length) return <p>Loading...</p>;

    const currentItem = conversation[current];

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow flex flex-col gap-6">
            <h2 className="text-2xl font-bold">Conversation Practice</h2>

            <div className="text-xl">{currentItem.prompt_text}</div>

            <TTSButton text={currentItem.prompt_text} lang={langCode} />

            <VoiceInput
                lang={langCode}
                onResult={(result) => {
                    setUserInput(result);
                }}
            />

            {userInput && (
                <div className="p-2 border rounded text-gray-700">
                    📝 Your input: {userInput}
                </div>
            )}

            <div className="flex gap-3">
                <Button onClick={handleCheck}>Check ✔</Button>
                <Button onClick={handleNext}>Skip ▶</Button>
            </div>
        </div>
    );
}
