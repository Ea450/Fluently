'use client';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import Image from 'next/image';
import { getLanguages, saveLesson } from '@/lib/actions/languages';
import { levels, topics } from '@/constant/data';
const CreateLesson = () => {
    const [languages, setLanguages] = useState<Languages[]>([]);
    const [formData, setFormData] = useState({
        language_id: '',
        topic_id: '',
        duration: '',
        level: '',
    });


    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const langs = await getLanguages();
                setLanguages(langs || []);
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };
        fetchData();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveLesson({
                language_id: formData.language_id,
                topic_id: formData.topic_id,
                duration: parseInt(formData.duration),
                level: formData.level,
            });
            alert('✅ Session saved!');
            setFormData({ language_id: '', topic_id: '', duration: '', level: '' });
        } catch (err) {
            console.error('❌ Error saving:', err);
            alert('Error saving session.');
        }
        setLoading(false);
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-white dark:bg-[#1F2937] rounded-2xl shadow flex flex-col gap-6 container mt-20"
        >
            <h2 className="text-2xl font-bold">Start a Lesson</h2>

            {/* Language */}
            <div className="flex flex-col gap-2">
                <Label>Language</Label>
                <Select
                    onValueChange={(value) =>
                        setFormData({ ...formData, language_id: value })
                    }
                    value={formData.language_id}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={lang.flag_url}
                                        alt={lang.name}
                                        width={20}
                                        height={15}
                                        className="rounded-sm"
                                    />
                                    <span>{lang.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Topic */}
            <div className="flex flex-col gap-2">
                <Label>Topic</Label>
                <Select
                    onValueChange={(value) =>
                        setFormData({ ...formData, topic_id: value })
                    }
                    value={formData.topic_id}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                        {topics.map((topic) => (
                            <SelectItem key={topic.id} value={topic.id}>
                                {topic.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-2">
                <Label>Duration (minutes)</Label>
                <Input
                    type="number"
                    placeholder="Enter duration"
                    min="1"
                    max="120"
                    value={formData.duration}
                    onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                    }
                    required
                />
            </div>
            {/* Levels */}

            <div className="flex flex-col gap-2">
                <Label>Levels</Label>
                <Select
                    onValueChange={(value) =>
                        setFormData({ ...formData, level: value })
                    }
                    value={formData.level}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                    <SelectContent>
                        {levels.map((topic) => (
                            <SelectItem key={topic.id} value={topic.title}>
                                {topic.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* Submit Button */}
            <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Start Lesson'}
            </Button>
        </form>
    );

}

export default CreateLesson