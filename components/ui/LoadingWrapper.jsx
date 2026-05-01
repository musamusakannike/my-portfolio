"use client";

import React, { useState, useEffect } from "react";

export default function LoadingWrapper({ children, text = "CODIAC" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Give it enough time to completely guarantee Hero Three.js canvas and animations are initialized
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const timer2 = setTimeout(() => {
        setIsLoaded(true);
      }, 600);
      return () => clearTimeout(timer2);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isLoaded && (
        <div className={`loading-screen ${isFadingOut ? "fade-out" : ""}`}>
          <div className="loader-content">
            <div className="loader-ring" />
            <span className="loader-text">{text}</span>
          </div>
          <style jsx>{`
            .loading-screen {
              position: fixed;
              inset: 0;
              width: 100vw;
              height: 100vh;
              background: #0a0a0a;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 99999;
              opacity: 1;
              transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              pointer-events: none;
            }
            .loading-screen.fade-out {
              opacity: 0;
            }
            .loader-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 24px;
            }
            .loader-ring {
              width: 58px;
              height: 58px;
              border: 3px solid rgba(255, 255, 255, 0.08);
              border-top-color: #fff;
              border-radius: 50%;
              animation: spin 0.75s linear infinite;
            }
            .loader-text {
              font-family: "Syne", system-ui, sans-serif;
              color: #fff;
              font-size: 16px;
              font-weight: 700;
              letter-spacing: 0.28em;
              animation: pulse 1.5s ease-in-out infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      )}
      <div 
        style={{ 
          opacity: isFadingOut ? 1 : 0, 
          transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          width: "100%",
          minHeight: "100vh"
        }}
      >
        {children}
      </div>
    </>
  );
}
