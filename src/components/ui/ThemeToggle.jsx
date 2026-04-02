import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import Button from '../ui/Button';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-full w-10 h-10 p-0"
      onClick={() => setIsDark(!isDark)}
    >
      {isDark ? (
        <Sun size={20} className="text-amber-400 fill-amber-400" />
      ) : (
        <Moon size={20} className="text-primary-600 fill-primary-600/10" />
      )}
    </Button>
  );
};

export default ThemeToggle;
