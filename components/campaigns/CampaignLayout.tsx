"use client";

import { CampaignContentPanel } from "./CampaignContentPanel";
import { CampaignAIChatPanel } from "./CampaignAIChatPanel";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

export const CampaignLayout = () => {
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-full bg-white">
      {/* Left: Main content panel */}
      <div className="flex-1 overflow-hidden relative">
        <CampaignContentPanel />

        {/* Mobile: Floating chat toggle */}
        {isMobile && !isMobileChatOpen && (
          <button
            onClick={() => setIsMobileChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gray-900 text-white shadow-xl flex items-center justify-center z-40 animate-bounce-slow"
            aria-label="Open AI Assistant"
            title="Open AI Assistant"
          >
            <Sparkles className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Right: AI Chat panel - Desktop (fixed) */}
      {!isMobile && (
        <div className="w-[380px] border-l border-gray-100 flex-shrink-0">
          <CampaignAIChatPanel />
        </div>
      )}

      {/* Right: AI Chat panel - Mobile (slide-over drawer) */}
      <AnimatePresence>
        {isMobile && isMobileChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileChatOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-white shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-[60]">
                <button
                  onClick={() => setIsMobileChatOpen(false)}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <CampaignAIChatPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
