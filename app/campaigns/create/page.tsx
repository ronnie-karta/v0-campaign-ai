'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CampaignData, INITIAL_CAMPAIGN_DATA } from '@/lib/campaign-types';
import { StepIndicator } from '@/components/campaigns/StepIndicator';
import { CampaignStep } from '@/components/campaigns/steps/CampaignStep';
import { CustomiseStep } from '@/components/campaigns/steps/CustomiseStep';
import { RecipientsStep } from '@/components/campaigns/steps/RecipientsStep';
import { DeliveryStep } from '@/components/campaigns/steps/DeliveryStep';
import { PaymentStep } from '@/components/campaigns/steps/PaymentStep';
import { useAIAgent } from '@/hooks/useAIAgent';

const STEPS = [
  { id: 1, label: 'campaign', title: 'Campaign', icon: '📦' },
  { id: 2, label: 'recipients', title: 'Recipients', icon: '👥' },
  { id: 3, label: 'customise', title: 'Customise', icon: '✏️' },
  { id: 4, label: 'delivery', title: 'Delivery', icon: '✈️' },
  { id: 5, label: 'payment', title: 'Payment', icon: '💳' },
];

export default function CreateCampaignPage() {
  const { state = {}, forms = {}, set, setForm } = useAIAgent();

  const currentStep = state.campaignStep || 1;
  const campaignData = (forms.campaignForm as CampaignData) || INITIAL_CAMPAIGN_DATA;

  // Sync state if empty
  useEffect(() => {
    if (!state.campaignStep) {
      set('campaignStep', 1);
    }
    if (!forms.campaignForm) {
      setForm('campaignForm', INITIAL_CAMPAIGN_DATA);
    }
  }, [state.campaignStep, forms.campaignForm, set, setForm]);

  const setCurrentStep = (step: number) => {
    set('campaignStep', step);
  };

  const handleDataChange = (updates: Partial<CampaignData>) => {
    setForm('campaignForm', { ...campaignData, ...updates });
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(campaignData.campaignName && campaignData.campaignType && campaignData.description && campaignData.budget > 0);
      case 2:
        return campaignData.recipients.length > 0;
      case 3:
        return !!(campaignData.senderName && campaignData.messageContent && 
          (campaignData.campaignType !== 'email' || campaignData.senderEmail) &&
          (campaignData.campaignType !== 'sms' || campaignData.senderPhone));
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
      setCurrentStep(Math.min(currentStep + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = () => {
    if (isStepValid()) {
      console.log('Campaign submitted:', campaignData);
      alert('Campaign created successfully! (This is a demo)');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-200">
      <main className="max-w-4xl mx-auto px-6 py-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Campaign Builder</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Refine your message and reach your audience with absolute precision.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-16">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 mb-12">
          {/* Step 1: Campaign */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">1. Identity & Goals</h2>
              <CampaignStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Step 2: Recipients */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">2. Target Audience</h2>
              <RecipientsStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Step 3: Customise */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">3. Creative Content</h2>
              <CustomiseStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Step 4: Delivery */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">4. Logistics</h2>
              <DeliveryStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">5. Final Review</h2>
              <PaymentStep data={campaignData} onChange={handleDataChange} />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-16 flex justify-between items-center pt-10 border-t border-gray-50">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-8 py-3 rounded-xl border border-gray-200 text-sm font-bold tracking-widest uppercase hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
              Phase {currentStep} of {STEPS.length}
            </div>

            {currentStep === STEPS.length ? (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="px-10 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-10 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Progress Info */}
        <div className="flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest uppercase text-gray-300">
          <div className="h-[1px] w-12 bg-gray-100"></div>
          <span>Progress {Math.round((currentStep / STEPS.length) * 100)}%</span>
          <div className="h-[1px] w-12 bg-gray-100"></div>
        </div>
      </main>
    </div>
  );
}
