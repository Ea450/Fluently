'use client'

import { useEffect, useState } from 'react';
import { FaMoon } from 'react-icons/fa';
import { MdSunny } from 'react-icons/md';

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
            className="bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-sm sm:text-base h-7 sm:h-8 px-2 cursor-pointer"
        >
            {theme === 'dark' ? <MdSunny /> : <FaMoon />}
        </button>
    );
}
