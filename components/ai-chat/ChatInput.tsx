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
    <form onSubmit={handleSubmit} className="flex gap-3 items-end p-2 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-gray-300 focus-within:bg-white transition-all group">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a command..."
        disabled={isLoading}
        className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none disabled:cursor-not-allowed text-sm font-medium placeholder:text-gray-400"
        maxLength={500}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-xs font-bold tracking-widest uppercase flex-shrink-0 active:scale-95"
        title={isLoading ? "Processing..." : !input.trim() ? "Type a message first" : "Send message"}
      >
        {isLoading ? "..." : "Send"}
      </button>
    </form>
  );
};
