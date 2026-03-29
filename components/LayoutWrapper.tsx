"use client";

import { usePathname } from "next/navigation";
import { CampaignLayout } from "./campaigns/CampaignLayout";
import { Header } from "./Header";
import { ChatWidget } from "./ai-chat/ChatWidget";
import { ModalManager } from "./ai-chat/ModalManager";
import { Toaster } from "./ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";
import { useCampaignUIStore } from "@/store/useCampaignUIStore";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isCampaignBuilderRoute = pathname === "/campaigns/create" || /^\/campaigns\/[^/]+\/edit$/.test(pathname);
  const { setActiveView } = useCampaignUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync active view based on initial route
  useEffect(() => {
    if (isCampaignBuilderRoute) {
      setActiveView("campaignForm");
    } else if (pathname === "/campaigns") {
      setActiveView("campaignList");
    }
  }, [pathname, setActiveView]);

  // Prevent hydration mismatch by returning a consistent base layout until mounted
  if (!mounted) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }

  if (isCampaignBuilderRoute) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        <Header />
        <div className="h-16 flex-shrink-0" /> {/* Spacer for fixed header */}
        <div className="flex-1 overflow-hidden">
          <CampaignLayout />
        </div>
        {/* ChatWidget intentionally omitted — CampaignLayout has its own AI chat panel */}
        <ModalManager />
        <Toaster />
        <Analytics />
      </div>
    );
  }

  return (
    <>
      <Header />
      {children}
      <ChatWidget />
      <ModalManager />
      <Toaster />
      <Analytics />
    </>
  );
};
