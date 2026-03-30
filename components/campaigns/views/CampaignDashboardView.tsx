"use client";

import { useCampaignUIStore } from "@/store/useCampaignUIStore";
import { Sparkles, List, Plus } from "lucide-react";

export const CampaignDashboardView = () => {
  const { setActiveView } = useCampaignUIStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-white text-gray-900">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-900 text-white mb-8 shadow-xl">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight mb-6">Campaign Center</h1>
          <p className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
            Harness the power of Campaign AI to create, scale, and optimize your marketing operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setActiveView("campaignList")}
            className="flex flex-col items-start p-8 rounded-3xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:text-white transition-colors">
              <List className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">View Campaigns</h3>
            <p className="text-gray-500 text-sm">Monitor your active and scheduled marketing efforts.</p>
          </button>

          <button
            onClick={() => setActiveView("campaignForm")}
            className="flex flex-col items-start p-8 rounded-3xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:text-white transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Create New</h3>
            <p className="text-gray-500 text-sm">Start building a precision-targeted campaign from scratch.</p>
          </button>
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-gray-50/50 border border-gray-100 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Pro Tip: You can ask the AI assistant on the right to "Draft a new email campaign for our summer sale" to get started instantly.
          </p>
        </div>
      </div>
    </div>
  );
};
