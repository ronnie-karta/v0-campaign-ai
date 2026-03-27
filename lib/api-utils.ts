export function serializeCampaign(campaign: any) {
  if (!campaign) return null;
  return {
    ...campaign,
    budget: campaign.budget ? Number(campaign.budget) : null,
    cost: campaign.cost ? Number(campaign.cost) : null,
  };
}
