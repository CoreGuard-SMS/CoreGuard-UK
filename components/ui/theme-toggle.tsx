"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <>
      <style jsx>{`
        .theme-toggle {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
        
        .dark .theme-toggle {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dark .theme-toggle:hover {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .theme-toggle-btn {
          position: relative;
          z-index: 10;
          transition: all 0.3s ease;
        }
        
        .theme-icon {
          transition: all 0.3s ease;
        }
        
        .sun-icon {
          color: #fbbf24;
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
        }
        
        .moon-icon {
          color: #e2e8f0;
          filter: drop-shadow(0 0 8px rgba(226, 232, 240, 0.5));
        }
      `}</style>
      
      <button
        className="theme-toggle p-2 rounded-lg"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        <div className="theme-toggle-btn">
          {isDark ? (
            <Sun className="theme-icon sun-icon h-5 w-5" />
          ) : (
            <Moon className="theme-icon moon-icon h-5 w-5" />
          )}
        </div>
      </button>
    </>
  );
}
