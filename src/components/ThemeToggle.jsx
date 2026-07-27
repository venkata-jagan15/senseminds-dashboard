import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, onToggleTheme }) {
  const isLight = theme === 'light';

  return (
    <button
      onClick={onToggleTheme}
      className="theme-toggle-btn"
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Theme`}
      aria-label="Toggle theme"
    >
      {isLight ? (
        <>
          <Moon size={16} color="#1565C0" />
          <span style={{ color: '#263238' }}>Dark Theme</span>
        </>
      ) : (
        <>
          <Sun size={16} color="#f59e0b" />
          <span style={{ color: '#f1f5f9' }}>Light Theme</span>
        </>
      )}
    </button>
  );
}
