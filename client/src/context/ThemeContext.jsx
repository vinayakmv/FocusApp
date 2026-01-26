import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Default to 'aurora' if no theme is saved
    const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'aurora');

    useEffect(() => {
        // Save to local storage
        localStorage.setItem('app-theme', theme);

        // Remove old theme classes
        document.documentElement.classList.remove('theme-aurora', 'theme-obsidian', 'theme-emerald', 'theme-red');

        // Add new theme class
        document.documentElement.classList.add(`theme-${theme}`);
    }, [theme]);

    const themes = [
        { id: 'aurora', name: 'Aurora (Default)', icon: '🔮', colors: 'from-violet-600 to-indigo-600' },
        { id: 'obsidian', name: 'Obsidian (Dark)', icon: '🌑', colors: 'from-gray-700 to-black' },
        { id: 'emerald', name: 'Deep Focus (Nature)', icon: '🌲', colors: 'from-emerald-800 to-green-900' },
        { id: 'red', name: 'Red Alert (High Stakes)', icon: '🔴', colors: 'from-red-900 to-black' },
    ];

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
