'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Pencil, Trash2, Users, DollarSign, CalendarDays, Send } from 'lucide-react';

interface Recipient {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  channel: string;
  status: string;
  deliveryStatus?: string;
  paymentStatus?: string;
  recipientCount: number;
  budget: number;
  cost?: number;
  sendDate?: string;
  sendTime?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

interface CampaignViewViewProps {
  id: string;
}

const STAT_STATUS_COLORS: Record<string, string> = {
  Sent: 'bg-gray-900 text-white border-gray-900',
  Completed: 'bg-gray-900 text-white border-gray-900',
  Scheduled: 'bg-blue-50 text-blue-600 border-blue-100',
  Draft: 'bg-gray-50 text-gray-500 border-gray-200',
};

const RECIPIENT_STATUS_COLORS: Record<string, string> = {
  Sent: 'bg-green-50 text-green-600 border-green-100',
  Failed: 'bg-red-50 text-red-600 border-red-100',
  Pending: 'bg-gray-50 text-gray-500 border-gray-100',
};

export const CampaignViewView = ({ id }: CampaignViewViewProps) => {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [campaignRes, recipientsRes] = await Promise.all([
          fetch(`/api/campaigns/${id}`),
          fetch(`/api/campaigns/${id}/recipients`),
        ]);

        if (!campaignRes.ok) {
          router.push('/campaigns');
          return;
        }

        setCampaign(await campaignRes.json());
        if (recipientsRes.ok) setRecipients(await recipientsRes.json());
      } catch (error) {
        console.error('Failed to fetch campaign:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      if (res.ok) router.push('/campaigns');
      else alert('Failed to delete campaign');
    } catch {
      alert('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 animate-pulse font-medium tracking-widest uppercase text-xs">
          Loading...
        </p>
      </div>
    );
  }

  if (!campaign) return null;

  const statusColor = STAT_STATUS_COLORS[campaign.status] ?? 'bg-white text-gray-500 border-gray-200';

  return (
    <div className="bg-white text-gray-900 h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/campaigns')}
            className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={() => router.push(`/campaigns/create?id=${campaign.id}`)}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-lg border ${statusColor}`}>
              {campaign.status}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
              {campaign.channel || 'Not Set'}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{campaign.name || 'Untitled Campaign'}</h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            {campaign.description || 'No description provided.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/30 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <p className="text-[10px] font-bold tracking-widest uppercase">Recipients</p>
            </div>
            <p className="text-2xl font-bold">{campaign.recipientCount?.toLocaleString() || 0}</p>
          </div>
          <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/30 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <DollarSign className="w-3.5 h-3.5" />
              <p className="text-[10px] font-bold tracking-widest uppercase">Budget</p>
            </div>
            <p className="text-2xl font-bold">${Number(campaign.budget || 0).toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/30 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Send className="w-3.5 h-3.5" />
              <p className="text-[10px] font-bold tracking-widest uppercase">Actual Cost</p>
            </div>
            <p className="text-2xl font-bold">${Number(campaign.cost || 0).toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/30 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <CalendarDays className="w-3.5 h-3.5" />
              <p className="text-[10px] font-bold tracking-widest uppercase">Created</p>
            </div>
            <p className="text-lg font-bold">{format(new Date(campaign.createdAt), 'MMM dd, yyyy')}</p>
          </div>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Delivery</p>
            <p className="text-sm font-semibold text-gray-900">
              {campaign.sendDate && campaign.sendTime
                ? `${campaign.sendDate} at ${campaign.sendTime}`
                : 'Not scheduled'}
            </p>
            {campaign.timezone && (
              <p className="text-xs text-gray-400 mt-0.5">{campaign.timezone}</p>
            )}
          </div>
          <div className="p-5 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Delivery Status</p>
            <p className="text-sm font-semibold text-gray-900">{campaign.deliveryStatus || 'Pending'}</p>
          </div>
          <div className="p-5 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Payment Status</p>
            <p className="text-sm font-semibold text-gray-900">{campaign.paymentStatus || 'Pending'}</p>
          </div>
        </div>

        {/* Recipients Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">Recipients</h2>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400">
              {recipients.length} total
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-gray-400">Name</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-gray-400">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recipients.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-gray-400 text-sm">
                        No recipients added yet.
                      </td>
                    </tr>
                  ) : (
                    recipients.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{r.name || 'Anonymous'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{r.email || r.phone || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded border ${RECIPIENT_STATUS_COLORS[r.status] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
