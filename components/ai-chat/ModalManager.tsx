"use client";

import { useAIAgent } from "@/hooks/useAIAgent";
import { CampaignModal } from "@/components/campaigns/CampaignModal";

export const ModalManager = () => {
  const { activeModal, modalData, setActiveModal } = useAIAgent();

  if (!activeModal) {
    return null;
  }

  // Render campaign modal
  if (activeModal === "campaign-creation") {
    return <CampaignModal onClose={() => setActiveModal(null)} />;
  }

  // Render generic modal
  const handleClose = () => {
    setActiveModal(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {modalData?.title || "Modal"}
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {modalData?.content || "No content provided"}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {modalData?.actionText && (
            <button
              onClick={() => {
                if (modalData?.onAction) {
                  modalData.onAction();
                }
                handleClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {modalData.actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
