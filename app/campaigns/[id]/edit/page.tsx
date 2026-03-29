'use client';

import { use } from 'react';
import { CampaignBuilderPage } from '@/components/campaigns/CampaignBuilderPage';

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CampaignBuilderPage editId={id} />;
}
