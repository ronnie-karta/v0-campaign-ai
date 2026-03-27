"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

interface AISuggestionWrapperProps {
  children: React.ReactNode;
  isSuggested?: boolean;
  shouldFocus?: boolean;
}

export const AISuggestionWrapper = ({ children, isSuggested, shouldFocus }: AISuggestionWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldFocus && containerRef.current) {
      const focusable = containerRef.current.querySelector('input, textarea, select, button');
      if (focusable instanceof HTMLElement) {
        focusable.focus();
      }
    }
  }, [shouldFocus]);

  return (
    <div ref={containerRef} className={`relative rounded-xl transition-all duration-500 ${isSuggested ? 'ring-2 ring-blue-400/30 bg-blue-50/10 p-1 -m-1' : ''}`}>
      {children}
      {isSuggested && (
        <div className="absolute top-0 right-0 -translate-y-1/2 flex items-center gap-1 bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-in fade-in zoom-in duration-300">
          <Sparkles className="w-2 h-2" />
          <span>AI SUGGESTED</span>
        </div>
      )}
    </div>
  );
};
