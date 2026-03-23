"use client";

import { useState, useRef, useEffect } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";

export const ChatInput = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isLoading } = useAIAgent();

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) {
      return;
    }

    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm resize-none"
        maxLength={500}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium whitespace-nowrap flex-shrink-0"
        title={isLoading ? "Sending..." : !input.trim() ? "Type a message first" : "Send message"}
      >
        {isLoading ? "..." : "Send"}
      </button>
    </form>
  );
};
