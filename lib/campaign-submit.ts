import { CampaignData } from '@/lib/campaign-types';

/**
 * Maps frontend CampaignData to the API payload shape.
 */
function toApiPayload(data: CampaignData) {
  const channelMap: Record<string, string> = {
    email: 'Email',
    sms: 'SMS',
    both: 'Both',
  };

  return {
    name: data.campaignName || null,
    description: data.description || null,
    channel: channelMap[data.campaignType] || null,
    senderName: data.senderName || null,
    senderEmail: data.senderEmail || null,
    senderPhone: data.senderPhone || null,
    subject: data.subject || null,
    previewText: data.previewText || null,
    messageContent: data.messageContent || null,
    budget: data.budget || null,
    sendDate: data.sendDateTime ? new Date(data.sendDateTime).toISOString() : null,
    sendTime: data.sendDateTime ? new Date(data.sendDateTime).toLocaleTimeString() : null,
    timezone: data.timezone || 'UTC',
    status: data.scheduleType === 'immediate' ? 'Scheduled' : 'Scheduled',
    deliveryStatus: data.scheduleType === 'immediate' ? 'Pending' : 'Scheduled',
    isDraft: false,
    step: 5,
  };
}

/**
 * Saves recipients to a campaign via the bulk POST endpoint.
 */
async function saveRecipients(campaignId: string, recipients: CampaignData['recipients']) {
  if (!recipients || recipients.length === 0) return;

  const payload = recipients.map((r) => ({
    name: r.name || null,
    email: r.email || null,
    phone: r.phone || null,
  }));

  const res = await fetch(`/api/campaigns/${campaignId}/recipients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to save recipients');
  }
}

/**
 * Creates a new campaign and its recipients.
 * Returns the created campaign's ID.
 */
export async function createCampaign(data: CampaignData): Promise<string> {
  const payload = toApiPayload(data);

  const res = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create campaign');
  }

  const campaign = await res.json();

  // Save recipients
  await saveRecipients(campaign.id, data.recipients);

  return campaign.id;
}

/**
 * Updates an existing campaign and syncs recipients.
 */
export async function updateCampaign(campaignId: string, data: CampaignData): Promise<void> {
  const payload = toApiPayload(data);

  const res = await fetch(`/api/campaigns/${campaignId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update campaign');
  }

  // Save recipients (the endpoint handles bulk creation and updates recipientCount)
  await saveRecipients(campaignId, data.recipients);
}
