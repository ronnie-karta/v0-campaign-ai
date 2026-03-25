"use client";

import { useState, useEffect } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";
import { ChatWindow } from "./ChatWindow";

export const ChatWidget = () => {
  const { isOpen, setOpen } = useAIAgent();
  const [isExpanding, setIsExpanding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsExpanding(true);
    setOpen(!isOpen);
    setTimeout(() => setIsExpanding(false), 300);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat window - Responsive */}
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-96 h-[32rem] rounded-xl shadow-xl bg-white border border-gray-100 animate-in fade-in zoom-in-95 transition-all duration-300 max-sm:w-[calc(100vw-3rem)] max-sm:h-[calc(100vh-8rem)]"
          style={{
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <ChatWindow />
        </div>
      )}

      {/* Chat button */}
      <button
        onClick={handleToggle}
        className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-900 hover:bg-gray-800 focus:ring-gray-900 text-white`}
        title={isOpen ? "Close chat" : "Open chat"}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v14m7-7H5"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v14m7-7H5"
            />
          )}
        </svg>
      </button>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
