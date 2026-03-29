import { CampaignViewView } from '@/components/campaigns/views/CampaignViewView';

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CampaignViewView id={id} />;
}
