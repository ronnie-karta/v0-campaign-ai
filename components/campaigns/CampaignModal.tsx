'use client';

import { useState } from 'react';
import { CampaignStep } from './steps/CampaignStep';
import { CustomiseStep } from './steps/CustomiseStep';
import { RecipientsStep } from './steps/RecipientsStep';
import { DeliveryStep } from './steps/DeliveryStep';
import { PaymentStep } from './steps/PaymentStep';
import { StepIndicator } from './StepIndicator';
import { CampaignData } from '@/lib/campaign-types';
import { useAIAgent } from '@/store/useAIAgentStore';

const STEPS = ['Campaign', 'Customise', 'Recipients', 'Delivery', 'Payment'];

interface CampaignModalProps {
  onClose?: () => void;
}

export const CampaignModal = ({ onClose }: CampaignModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CampaignData>({
    name: '',
    type: 'email',
    description: '',
    budget: 0,
    subject: '',
    senderName: '',
    senderEmail: '',
    emailContent: '',
    smsContent: '',
    recipients: [],
    scheduleDate: '',
    scheduleTime: '09:00',
    timezone: 'UTC',
    frequency: 'once',
    paymentMethod: 'card',
    billingEmail: '',
  });

  const { setActiveModal } = useAIAgent();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Save campaign (mock)
    console.log('Campaign created:', formData);
    alert(`Campaign "${formData.name}" created successfully!`);
    setActiveModal(null);
    onClose?.();
  };

  const handleUpdateData = (updates: Partial<CampaignData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name && formData.type && formData.budget > 0;
      case 1:
        return (
          formData.subject &&
          formData.senderName &&
          formData.senderEmail &&
          (formData.emailContent || formData.smsContent)
        );
      case 2:
        return formData.recipients.length > 0;
      case 3:
        return formData.scheduleDate && formData.scheduleTime;
      case 4:
        return formData.paymentMethod && formData.billingEmail;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create Campaign</h2>
          <button
            onClick={() => {
              setActiveModal(null);
              onClose?.();
            }}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 0 && (
            <CampaignStep data={formData} onUpdate={handleUpdateData} />
          )}
          {currentStep === 1 && (
            <CustomiseStep data={formData} onUpdate={handleUpdateData} />
          )}
          {currentStep === 2 && (
            <RecipientsStep data={formData} onUpdate={handleUpdateData} />
          )}
          {currentStep === 3 && (
            <DeliveryStep data={formData} onUpdate={handleUpdateData} />
          )}
          {currentStep === 4 && (
            <PaymentStep data={formData} onUpdate={handleUpdateData} />
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {STEPS.length}
          </div>

          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Campaign
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
