'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createCampaign, updateCampaign } from '@/lib/campaign-submit';
import { toast } from '@/hooks/use-toast';
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
  { id: 2, label: 'customise', title: 'Customise', icon: '✏️' },
  { id: 3, label: 'recipients', title: 'Recipients', icon: '👥' },
  { id: 4, label: 'delivery', title: 'Delivery', icon: '✈️' },
  { id: 5, label: 'payment', title: 'Payment', icon: '💳' },
];

const FORM_IDS = [
  'campaignForm',
  'customiseForm',
  'recipientsForm',
  'deliveryForm',
  'paymentForm',
];

interface CampaignFormViewProps {
  data?: Record<string, any>;
}

export const CampaignFormView = ({ data }: CampaignFormViewProps) => {
  const { state = {}, forms = {}, set, setForm } = useAIAgent();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract editId from pathname like /campaigns/:id/edit
  const editMatch = pathname.match(/^\/campaigns\/([^/]+)\/edit$/);
  const editId = editMatch?.[1] || null;

  const currentStep = state.campaignStep || 1;

  // Source of truth is the AIAgent store. AI suggestions from props are used for highlighting.
  const campaignData: CampaignData = {
    ...INITIAL_CAMPAIGN_DATA,
    ...(forms.campaignForm || {}),
    ...(forms.customiseForm || {}),
    ...(forms.recipientsForm || {}),
    ...(forms.deliveryForm || {}),
    ...(forms.paymentForm || {}),
    // Map AI extracted fields if they are present in the form state
    campaignName: forms.campaignForm?.campaignName || forms.campaignForm?.name || INITIAL_CAMPAIGN_DATA.campaignName,
    messageContent: forms.customiseForm?.messageContent || forms.customiseForm?.message || INITIAL_CAMPAIGN_DATA.messageContent,
    sendDateTime: forms.deliveryForm?.sendDateTime || forms.deliveryForm?.date || INITIAL_CAMPAIGN_DATA.sendDateTime,
    paymentMethod: forms.paymentForm?.paymentMethod || forms.paymentForm?.method || INITIAL_CAMPAIGN_DATA.paymentMethod,
  };

  // Load existing campaign data when editing
  useEffect(() => {
    if (!editId) return;
    // Skip if already loaded for this campaign
    if (state.editingCampaignId === editId) return;

    setIsLoadingCampaign(true);

    async function loadCampaign() {
      try {
        const [campaignRes, recipientsRes] = await Promise.all([
          fetch(`/api/campaigns/${editId}`),
          fetch(`/api/campaigns/${editId}/recipients`),
        ]);

        if (!campaignRes.ok) return;

        const campaign = await campaignRes.json();
        const recipients = recipientsRes.ok ? await recipientsRes.json() : [];

        setForm('campaignForm', {
          campaignName: campaign.name || '',
          campaignType: campaign.channel?.toLowerCase() || 'email',
          description: campaign.description || '',
          budget: campaign.budget || 0,
        });

        setForm('customiseForm', {
          senderName: campaign.senderName || '',
          senderEmail: campaign.senderEmail || '',
          senderPhone: campaign.senderPhone || '',
          subject: campaign.subject || '',
          previewText: campaign.previewText || '',
          messageContent: campaign.messageContent || '',
        });

        setForm('recipientsForm', {
          recipients: recipients.map((r: any) => ({
            id: r.id,
            email: r.email || '',
            phone: r.phone || '',
            name: r.name || '',
          })),
        });

        setForm('deliveryForm', {
          scheduleType: campaign.sendDate ? 'scheduled' : 'immediate',
          sendDateTime: campaign.sendDate || '',
          timezone: campaign.timezone || 'UTC',
        });

        set('campaignStep', campaign.step || 1);
        set('editingCampaignId', editId);
      } catch (error) {
        console.error('Failed to load campaign:', error);
      } finally {
        setIsLoadingCampaign(false);
      }
    }

    loadCampaign();
  }, [editId, state.editingCampaignId, set, setForm]);

  useEffect(() => {
    if (editId) return;
    if (!state.campaignStep) {
      set('campaignStep', 1);
    }
  }, [editId, state.campaignStep, set]);

  // If data from AI changes, we might want to update the AI agent store too
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      // Logic to merge data into appropriate forms
      // For now, we'll let the CampaignContentPanel handle the passing of data
    }
  }, [data]);

  const setCurrentStep = (step: number) => {
    set('campaignStep', step);
  };

  const handleDataChange = (updates: Partial<CampaignData>) => {
    const currentFormId = FORM_IDS[currentStep - 1];
    const currentFormData = forms[currentFormId] || {};
    setForm(currentFormId, { ...currentFormData, ...updates });
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
      setCurrentStep(Math.min(currentStep + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setIsSubmitting(true);
    try {
      let campaignId: string;

      if (editId) {
        await updateCampaign(editId, campaignData);
        campaignId = editId;
        toast({ title: 'Campaign updated', description: 'Your campaign has been saved successfully.' });
      } else {
        campaignId = await createCampaign(campaignData);
        toast({ title: 'Campaign created', description: 'Your campaign has been created successfully.' });
      }

      router.push(`/campaigns/${campaignId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCampaign) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">Loading campaign...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 selection:bg-gray-200">
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {editId ? 'Edit Campaign' : 'Campaign Builder'}
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Refine your message and reach your audience with absolute precision.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 mb-12">
          {/* Step 1: Campaign */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">1. Identity & Goals</h2>
              <CampaignStep data={campaignData} onChange={handleDataChange} aiSuggestedData={data} />
            </div>
          )}

          {/* Step 2: Customise */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">2. Creative Content</h2>
              <CustomiseStep data={campaignData} onChange={handleDataChange} aiSuggestedData={data} />
            </div>
          )}

          {/* Step 3: Recipients */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">3. Target Audience</h2>
              <RecipientsStep data={campaignData} onChange={handleDataChange} aiSuggestedData={data} />
            </div>
          )}

          {/* Step 4: Delivery */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">4. Logistics</h2>
              <DeliveryStep data={campaignData} onChange={handleDataChange} aiSuggestedData={data} />
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-2xl font-bold tracking-tight mb-8">5. Final Review</h2>
              <PaymentStep data={campaignData} onChange={handleDataChange} aiSuggestedData={data} />
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
                disabled={!isStepValid() || isSubmitting}
                className="px-10 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {isSubmitting ? 'Submitting...' : editId ? 'Update' : 'Submit'}
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
};
