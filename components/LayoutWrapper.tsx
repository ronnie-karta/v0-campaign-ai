"use client";

import { usePathname } from "next/navigation";
import { CampaignLayout } from "./campaigns/CampaignLayout";
import { Header } from "./Header";
import { ChatWidget } from "./ai-chat/ChatWidget";
import { ModalManager } from "./ai-chat/ModalManager";
import { Toaster } from "./ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import { useEffect } from "react";
import { useCampaignUIStore } from "@/store/useCampaignUIStore";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isCampaignRoute = pathname.startsWith("/campaign");
  const { setActiveView } = useCampaignUIStore();

  // Sync active view based on initial route
  useEffect(() => {
    if (pathname === "/campaigns/create") {
      setActiveView("campaignForm");
    } else if (pathname === "/campaigns") {
      setActiveView("campaignList");
    } else if (isCampaignRoute) {
      setActiveView("campaignDashboard");
    }
  }, [pathname, isCampaignRoute, setActiveView]);

  if (isCampaignRoute) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        <Header />
        <div className="h-16 flex-shrink-0" /> {/* Spacer for fixed header */}
        <div className="flex-1 overflow-hidden">
          <CampaignLayout />
        </div>
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
