export interface Recipient {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
}

export interface CampaignData {
  // Step 1: Campaign
  campaignName: string;
  campaignType: 'email' | 'sms' | 'both';
  description: string;
  budget: number;

  // Step 2: Customise
  subject?: string; // Email only
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  messageContent: string;
  previewText?: string; // Email only

  // Step 3: Recipients
  recipients: Recipient[];

  // Step 4: Delivery
  scheduleType: 'immediate' | 'scheduled';
  sendDateTime?: string;
  timezone: string;
  repeatFrequency: 'once' | 'daily' | 'weekly' | 'monthly';

  // Step 5: Payment
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
  billingEmail: string;
  agreeToTerms: boolean;
}

export const INITIAL_CAMPAIGN_DATA: CampaignData = {
  campaignName: '',
  campaignType: 'email',
  description: '',
  budget: 0,
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  messageContent: '',
  recipients: [],
  scheduleType: 'immediate',
  timezone: 'UTC',
  repeatFrequency: 'once',
  paymentMethod: 'credit-card',
  billingEmail: '',
  agreeToTerms: false,
};
