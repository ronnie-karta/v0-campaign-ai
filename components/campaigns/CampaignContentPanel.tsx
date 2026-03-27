"use client";

import { useCampaignUIStore } from "@/store/useCampaignUIStore";
import { CampaignFormView } from "./views/CampaignFormView";
import { CampaignListView } from "./views/CampaignListView";
import { CampaignDashboardView } from "./views/CampaignDashboardView";
import { motion, AnimatePresence } from "framer-motion";

export const CampaignContentPanel = () => {
  const { activeView, formData } = useCampaignUIStore();

  const renderView = () => {
    switch (activeView) {
      case "campaignForm":
        return <CampaignFormView data={formData} />;
      case "campaignList":
        return <CampaignListView />;
      case "campaignDashboard":
      default:
        return <CampaignDashboardView />;
    }
  };

  return (
    <div className="h-full overflow-auto bg-white custom-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
