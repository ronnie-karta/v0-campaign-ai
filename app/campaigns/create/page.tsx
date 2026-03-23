'use client';

import { useState } from 'react';
import { CampaignData, INITIAL_CAMPAIGN_DATA } from '@/lib/campaign-types';
import { StepIndicator } from '@/components/campaigns/StepIndicator';
import { CampaignStep } from '@/components/campaigns/steps/CampaignStep';
import { CustomiseStep } from '@/components/campaigns/steps/CustomiseStep';
import { RecipientsStep } from '@/components/campaigns/steps/RecipientsStep';
import { DeliveryStep } from '@/components/campaigns/steps/DeliveryStep';
import { PaymentStep } from '@/components/campaigns/steps/PaymentStep';
import { Button } from '@/components/ui/button';

const STEPS = [
  { id: 1, label: 'campaign', title: 'Campaign', icon: '📦' },
  { id: 2, label: 'customise', title: 'Customise', icon: '✏️' },
  { id: 3, label: 'recipients', title: 'Recipients', icon: '👥' },
  { id: 4, label: 'delivery', title: 'Delivery', icon: '✈️' },
  { id: 5, label: 'payment', title: 'Payment', icon: '💳' },
];

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>(INITIAL_CAMPAIGN_DATA);

  const handleDataChange = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(campaignData.campaignName && campaignData.campaignType && campaignData.description && campaignData.budget > 0);
      case 2:
        return !!(campaignData.senderName && campaignData.messageContent && 
          (campaignData.campaignType !== 'email' || campaignData.senderEmail) &&
          (campaignData.campaignType !== 'sms' || campaignData.senderPhone));
      case 3:
        return campaignData.recipients.length > 0;
      case 4:
        return !!(campaignData.scheduleType === 'immediate' || campaignData.sendDateTime);
      case 5:
        return !!(campaignData.billingEmail && campaignData.agreeToTerms);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (isStepValid()) {
      console.log('Campaign submitted:', campaignData);
      alert('Campaign created successfully! (This is a demo)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Campaign</h1>
          <p className="text-gray-600">Set up your marketing campaign step by step</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Step 1: Campaign */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Details</h2>
              <CampaignStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Step 2: Customise */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customise Your Message</h2>
              <CustomiseStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Step 3: Recipients */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Recipients</h2>
              <RecipientsStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Step 4: Delivery */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Delivery</h2>
              <DeliveryStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Payment</h2>
              <PaymentStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between items-center pt-8 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-8"
            >
              Back
            </Button>

            <div className="text-sm text-gray-600">
              Step {currentStep} of {STEPS.length}
            </div>

            {currentStep === STEPS.length ? (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="px-8 bg-purple-600 hover:bg-purple-700"
              >
                Create Campaign
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-8 bg-purple-600 hover:bg-purple-700"
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Progress Info */}
        <div className="text-center text-sm text-gray-600">
          Progress: {Math.round((currentStep / STEPS.length) * 100)}%
        </div>
      </div>
    </div>
  );
}
