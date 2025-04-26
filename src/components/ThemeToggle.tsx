import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export function ThemeToggle() {
  const { isDarkMode, toggleTheme, isLoading } = useThemeStore();

  React.useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  if (isLoading) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}