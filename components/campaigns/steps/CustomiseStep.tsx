'use client';

import { CampaignData } from '@/lib/campaign-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CustomiseStepProps {
  data: CampaignData;
  onChange: (data: Partial<CampaignData>) => void;
}

export const CustomiseStep = ({ data, onChange }: CustomiseStepProps) => {
  const isEmailCampaign = data.campaignType === 'email' || data.campaignType === 'both';
  const isSmsCampaign = data.campaignType === 'sms' || data.campaignType === 'both';

  return (
    <div className="space-y-6">
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

      {isEmailCampaign && (
        <>
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
        </>
      )}

      {isSmsCampaign && (
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
      )}

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
    </div>
  );
};
