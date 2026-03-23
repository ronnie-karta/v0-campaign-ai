"use client";

import { useState } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";
import { ChatWindow } from "./ChatWindow";

export const ChatWidget = () => {
  const { isOpen, setOpen } = useAIAgent();
  const [isExpanding, setIsExpanding] = useState(false);

  const handleToggle = () => {
    setIsExpanding(true);
    setOpen(!isOpen);
    setTimeout(() => setIsExpanding(false), 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat window - Responsive */}
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-96 h-[32rem] rounded-lg shadow-2xl bg-white animate-in fade-in zoom-in-95 transition-all duration-300 max-sm:w-[calc(100vw-3rem)] max-sm:h-[calc(100vh-8rem)]"
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
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
            : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
        } text-white`}
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
              d="M6 18L18 6M6 6l12 12"
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
