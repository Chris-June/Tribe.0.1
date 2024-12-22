import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className={cn(
        "relative w-16 h-8 rounded-full p-1 transition-all duration-300 ease-in-out",
        "bg-gradient-to-br from-secondary/20 to-secondary/40",
        "border border-border/50 shadow-inner",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        className
      )}
      aria-label="Toggle theme"
    >
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full",
          "transition-all duration-300 ease-in-out transform",
          "bg-gradient-to-br from-primary/80 to-primary",
          "shadow-md",
          theme === 'light' 
            ? "translate-x-0 rotate-0 opacity-100" 
            : "translate-x-8 rotate-180 opacity-0"
        )}
      >
        {/* Light mode indicator */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-yellow-300/20 to-orange-400/20",
            "animate-pulse opacity-50",
            theme === 'light' ? "block" : "hidden"
          )}
        />
      </div>
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full",
          "transition-all duration-300 ease-in-out transform",
          "bg-gradient-to-br from-purple-800/80 to-purple-900",
          "shadow-md",
          theme === 'dark' 
            ? "translate-x-8 rotate-0 opacity-100" 
            : "translate-x-0 rotate-180 opacity-0"
        )}
      >
        {/* Dark mode indicator */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-purple-700/20 to-indigo-900/20",
            "animate-pulse opacity-50",
            theme === 'dark' ? "block" : "hidden"
          )}
        />
      </div>
    </button>
  );
};
