'use client';

import { CampaignData } from '@/lib/campaign-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AISuggestionWrapper } from '../AISuggestionWrapper';

interface CampaignStepProps {
  data: CampaignData;
  onChange: (data: Partial<CampaignData>) => void;
  aiSuggestedData?: Record<string, any>;
}

export const CampaignStep = ({ data, onChange, aiSuggestedData }: CampaignStepProps) => {
  const fields = ['campaignName', 'campaignType', 'description', 'budget'];
  const firstEmptyField = fields.find(field => !data[field as keyof typeof data]);

  const isSuggested = (field: string) => {
    if (!aiSuggestedData) return false;
    if (field === 'campaignName') return 'name' in aiSuggestedData || 'campaignName' in aiSuggestedData;
    return field in aiSuggestedData;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AISuggestionWrapper isSuggested={isSuggested('campaignName')} shouldFocus={firstEmptyField === 'campaignName'}>
        <div>
          <Label htmlFor="campaignName" className="text-base font-semibold">
            Campaign Name
          </Label>
          <p className="text-sm text-gray-600 mb-2">Give your campaign a clear and descriptive name</p>
          <Input
            id="campaignName"
            placeholder="e.g., Summer Sale 2024"
            value={data.campaignName}
            onChange={(e) => onChange({ campaignName: e.target.value })}
            className="mt-2"
          />
        </div>
      </AISuggestionWrapper>

      <AISuggestionWrapper isSuggested={isSuggested('campaignType')} shouldFocus={firstEmptyField === 'campaignType'}>
        <div>
          <Label htmlFor="campaignType" className="text-base font-semibold">
            Campaign Type
          </Label>
          <p className="text-sm text-gray-600 mb-2">Choose how you want to reach your audience</p>
          <Select value={data.campaignType} onValueChange={(value: any) => onChange({ campaignType: value })}>
            <SelectTrigger id="campaignType" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email Campaign</SelectItem>
              <SelectItem value="sms">SMS Campaign</SelectItem>
              <SelectItem value="both">Email & SMS Campaign</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AISuggestionWrapper>

      <div className="md:col-span-2">
        <AISuggestionWrapper isSuggested={isSuggested('description')} shouldFocus={firstEmptyField === 'description'}>
          <div>
            <Label htmlFor="description" className="text-base font-semibold">
              Campaign Description
            </Label>
            <p className="text-sm text-gray-600 mb-2">Provide details about your campaign goals and content</p>
            <Textarea
              id="description"
              placeholder="e.g., Promote our summer collection with 30% discount..."
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="mt-2 resize-none"
              rows={4}
            />
          </div>
        </AISuggestionWrapper>
      </div>

      <AISuggestionWrapper isSuggested={isSuggested('budget')} shouldFocus={firstEmptyField === 'budget'}>
        <div>
          <Label htmlFor="budget" className="text-base font-semibold">
            Campaign Budget ($)
          </Label>
          <p className="text-sm text-gray-600 mb-2">Set your budget for this campaign</p>
          <Input
            id="budget"
            type="number"
            placeholder="1,000"
            value={data.budget || ''}
            onChange={(e) => onChange({ budget: parseFloat(e.target.value) || 0 })}
            className="mt-2"
            min="0"
            step="100"
          />
        </div>
      </AISuggestionWrapper>
    </div>
  );
};
