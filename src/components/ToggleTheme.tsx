'use client'

import { useEffect, useState } from 'react';

export default function ToggleTheme() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // On mount, check localStorage or system preference
        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'dark') {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setTheme('light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setTheme('dark');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className='p-2 rounded border dark:border-white border-black'
        >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
    );
}
