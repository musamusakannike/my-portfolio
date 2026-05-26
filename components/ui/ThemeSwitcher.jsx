"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="theme-switcher-btn"
      aria-label="Toggle Legibility Theme"
    >
      <div className="icon-wrapper">
        {theme === "dark" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sun-icon"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M6.34 17.66l-1.41-1.41" />
            <path d="M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="moon-icon"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </div>
      
      <style jsx>{`
        .theme-switcher-btn {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
          outline: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .theme-switcher-btn:hover {
          background: var(--bg-tertiary);
          border-color: var(--color-toxic-green);
          transform: scale(1.05);
        }
        
        .theme-switcher-btn:active {
          transform: scale(0.95);
        }
        
        .icon-wrapper {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        :global(.sun-icon) {
          color: #eab308;
          animation: rotate-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        :global(.moon-icon) {
          color: var(--text-primary);
          animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        @keyframes rotate-in {
          0% {
            transform: rotate(-90deg) scale(0);
            opacity: 0;
          }
          100% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </button>
  );
}
