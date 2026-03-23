'use client';

import { CampaignData } from '@/lib/campaign-types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PaymentStepProps {
  data: CampaignData;
  onChange: (data: Partial<CampaignData>) => void;
}

export const PaymentStep = ({ data, onChange }: PaymentStepProps) => {
  const calculateCost = (): number => {
    const baseRate = data.campaignType === 'email' ? 0.01 : 0.05;
    return Math.round(data.recipients.length * baseRate * 100) / 100;
  };

  const cost = calculateCost();

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-4">Campaign Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Campaign Name:</span>
            <span className="font-medium text-gray-900">{data.campaignName || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Type:</span>
            <span className="font-medium text-gray-900 capitalize">{data.campaignType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Recipients:</span>
            <span className="font-medium text-gray-900">{data.recipients.length}</span>
          </div>
          <div className="border-t border-purple-200 pt-3 mt-3 flex justify-between">
            <span className="text-gray-700 font-semibold">Total Cost:</span>
            <span className="font-bold text-purple-600 text-lg">${cost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold block mb-2">Billing Email</Label>
        <p className="text-sm text-gray-600 mb-2">Receipt will be sent to this email address</p>
        <Input
          type="email"
          placeholder="billing@example.com"
          value={data.billingEmail}
          onChange={(e) => onChange({ billingEmail: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-base font-semibold block mb-3">Payment Method</Label>
        <p className="text-sm text-gray-600 mb-3">Choose how you'd like to pay</p>

        <div className="space-y-3">
          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50" style={{borderColor: data.paymentMethod === 'credit-card' ? '#9333ea' : '#e5e7eb'}}>
            <input
              type="radio"
              name="paymentMethod"
              value="credit-card"
              checked={data.paymentMethod === 'credit-card'}
              onChange={(e) => onChange({ paymentMethod: e.target.value as any })}
              className="w-4 h-4"
            />
            <div className="ml-3">
              <p className="font-semibold text-gray-900">💳 Credit Card</p>
              <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
            </div>
          </label>

          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50" style={{borderColor: data.paymentMethod === 'paypal' ? '#9333ea' : '#e5e7eb'}}>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={data.paymentMethod === 'paypal'}
              onChange={(e) => onChange({ paymentMethod: e.target.value as any })}
              className="w-4 h-4"
            />
            <div className="ml-3">
              <p className="font-semibold text-gray-900">🅿️ PayPal</p>
              <p className="text-sm text-gray-600">Fast and secure PayPal payment</p>
            </div>
          </label>

          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50" style={{borderColor: data.paymentMethod === 'bank-transfer' ? '#9333ea' : '#e5e7eb'}}>
            <input
              type="radio"
              name="paymentMethod"
              value="bank-transfer"
              checked={data.paymentMethod === 'bank-transfer'}
              onChange={(e) => onChange({ paymentMethod: e.target.value as any })}
              className="w-4 h-4"
            />
            <div className="ml-3">
              <p className="font-semibold text-gray-900">🏦 Bank Transfer</p>
              <p className="text-sm text-gray-600">Direct bank transfer (2-3 business days)</p>
            </div>
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-start gap-3 mb-4">
          <Checkbox
            id="agreeTerms"
            checked={data.agreeToTerms}
            onCheckedChange={(checked) => onChange({ agreeToTerms: checked as boolean })}
            className="mt-1"
          />
          <Label htmlFor="agreeTerms" className="text-sm text-gray-700 font-normal cursor-pointer">
            I agree to the Terms of Service and Privacy Policy. I understand that I will be charged ${cost.toFixed(2)} for this campaign.
          </Label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          By proceeding, you authorize us to charge your selected payment method. Your campaign will be reviewed before sending.
        </p>
      </div>
    </div>
  );
};
