'use client';

import { CampaignData } from '@/lib/campaign-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AISuggestionWrapper } from '../AISuggestionWrapper';

interface CustomiseStepProps {
  data: CampaignData;
  onChange: (data: Partial<CampaignData>) => void;
  aiSuggestedData?: Record<string, any>;
}

export const CustomiseStep = ({ data, onChange, aiSuggestedData }: CustomiseStepProps) => {
  const isEmailCampaign = data.campaignType === 'email' || data.campaignType === 'both';
  const isSmsCampaign = data.campaignType === 'sms' || data.campaignType === 'both';

  const fields = [
    'senderName',
    ...(isEmailCampaign ? ['senderEmail', 'subject', 'previewText'] : []),
    ...(isSmsCampaign ? ['senderPhone'] : []),
    'messageContent'
  ];
  const firstEmptyField = fields.find(field => !data[field as keyof typeof data]);

  const isSuggested = (field: string) => {
    if (!aiSuggestedData) return false;
    if (field === 'messageContent') return 'message' in aiSuggestedData || 'messageContent' in aiSuggestedData;
    return field in aiSuggestedData;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AISuggestionWrapper isSuggested={isSuggested('senderName')} shouldFocus={firstEmptyField === 'senderName'}>
        <div>
          <Label htmlFor="senderName" className="text-base font-semibold">
            Sender Name
          </Label>
          <p className="text-sm text-gray-600 mb-2">How should the message appear to come from?</p>
          <Input
            id="senderName"
            placeholder="e.g., John from ABC Company"
            value={data.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
            className="mt-2"
          />
        </div>
      </AISuggestionWrapper>

      {isEmailCampaign && (
        <>
          <AISuggestionWrapper isSuggested={isSuggested('senderEmail')} shouldFocus={firstEmptyField === 'senderEmail'}>
            <div>
              <Label htmlFor="senderEmail" className="text-base font-semibold">
                Sender Email Address
              </Label>
              <p className="text-sm text-gray-600 mb-2">Email address replies will be sent to</p>
              <Input
                id="senderEmail"
                type="email"
                placeholder="hello@example.com"
                value={data.senderEmail}
                onChange={(e) => onChange({ senderEmail: e.target.value })}
                className="mt-2"
              />
            </div>
          </AISuggestionWrapper>

          <AISuggestionWrapper isSuggested={isSuggested('subject')} shouldFocus={firstEmptyField === 'subject'}>
            <div>
              <Label htmlFor="subject" className="text-base font-semibold">
                Email Subject
              </Label>
              <p className="text-sm text-gray-600 mb-2">Subject line that recipients will see</p>
              <Input
                id="subject"
                placeholder="e.g., Exclusive 30% Off Summer Collection"
                value={data.subject}
                onChange={(e) => onChange({ subject: e.target.value })}
                className="mt-2"
              />
            </div>
          </AISuggestionWrapper>

          <AISuggestionWrapper isSuggested={isSuggested('previewText')} shouldFocus={firstEmptyField === 'previewText'}>
            <div>
              <Label htmlFor="previewText" className="text-base font-semibold">
                Preview Text
              </Label>
              <p className="text-sm text-gray-600 mb-2">Short text shown before email body (optional)</p>
              <Input
                id="previewText"
                placeholder="e.g., Shop our collection with exclusive savings"
                value={data.previewText}
                onChange={(e) => onChange({ previewText: e.target.value })}
                className="mt-2"
              />
            </div>
          </AISuggestionWrapper>
        </>
      )}

      {isSmsCampaign && (
        <AISuggestionWrapper isSuggested={isSuggested('senderPhone')} shouldFocus={firstEmptyField === 'senderPhone'}>
          <div>
            <Label htmlFor="senderPhone" className="text-base font-semibold">
              Sender Phone Number
            </Label>
            <p className="text-sm text-gray-600 mb-2">Phone number for SMS messages</p>
            <Input
              id="senderPhone"
              placeholder="+1-555-0000"
              value={data.senderPhone}
              onChange={(e) => onChange({ senderPhone: e.target.value })}
              className="mt-2"
            />
          </div>
        </AISuggestionWrapper>
      )}

      <div className="md:col-span-2">
        <AISuggestionWrapper isSuggested={isSuggested('messageContent')} shouldFocus={firstEmptyField === 'messageContent'}>
          <div>
            <Label htmlFor="messageContent" className="text-base font-semibold">
              Message Content
            </Label>
            <p className="text-sm text-gray-600 mb-2">
              {isEmailCampaign ? 'Email body content' : 'SMS message'} (keep it clear and compelling)
            </p>
            <Textarea
              id="messageContent"
              placeholder="Write your message here..."
              value={data.messageContent}
              onChange={(e) => onChange({ messageContent: e.target.value })}
              className="mt-2 resize-none"
              rows={6}
              maxLength={isSmsCampaign && !isEmailCampaign ? 160 : 5000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {data.messageContent.length} / {isSmsCampaign && !isEmailCampaign ? 160 : 5000} characters
            </p>
          </div>
        </AISuggestionWrapper>
      </div>
    </div>
  );
};
