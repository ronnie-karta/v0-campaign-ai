'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

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
  recipientCount: number;
  budget: number;
  cost?: number;
  createdAt: string;
  updatedAt: string;
  sendDate?: string;
  sendTime?: string;
}

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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

        if (campaignRes.ok) {
          const campaignData = await campaignRes.json();
          setCampaign(campaignData);
        } else {
          router.push('/campaigns');
        }

        if (recipientsRes.ok) {
          const recipientsData = await recipientsRes.json();
          setRecipients(recipientsData);
        }
      } catch (error) {
        console.error('Failed to fetch campaign data:', error);
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
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/campaigns');
      } else {
        alert('Failed to delete campaign');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 animate-pulse font-medium tracking-widest uppercase text-xs">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-200">
      <main className="max-w-6xl mx-auto px-6 py-32">
        {/* Breadcrumbs & Actions */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/campaigns" className="text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2">
            <span>←</span>
            <span>Back to Campaigns</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs font-bold tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <Link href={`/campaigns/create?id=${campaign.id}`}>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-all shadow-sm">
                Edit Campaign
              </button>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-lg border ${
              campaign.status === 'Sent' || campaign.status === 'Completed'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200'
            }`}>
              {campaign.status}
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{campaign.channel || 'Not Set'}</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">{campaign.name || 'Untitled Campaign'}</h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            {campaign.description || 'No description provided for this campaign.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
          <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/30">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Recipients</p>
            <p className="text-3xl font-bold">{campaign.recipientCount?.toLocaleString() || 0}</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/30">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Budget</p>
            <p className="text-3xl font-bold">${Number(campaign.budget || 0).toLocaleString()}</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/30">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Actual Cost</p>
            <p className="text-3xl font-bold">${Number(campaign.cost || 0).toLocaleString()}</p>
          </div>
          <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50/30">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Created</p>
            <p className="text-xl font-bold">{format(new Date(campaign.createdAt), 'MMM dd, yyyy')}</p>
          </div>
        </div>

        {/* Recipients Section */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl font-bold tracking-tight">Recipients List</h2>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Total {recipients.length}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Name</th>
                    <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Contact</th>
                    <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recipients.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-8 py-12 text-center text-gray-400 text-sm">
                        No recipients added to this campaign yet.
                      </td>
                    </tr>
                  ) : (
                    recipients.map((recipient) => (
                      <tr key={recipient.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6 text-sm font-bold text-gray-900">{recipient.name || 'Anonymous'}</td>
                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                          {recipient.email || recipient.phone || 'No contact info'}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 text-[9px] font-bold tracking-wider uppercase rounded border ${
                            recipient.status === 'Sent'
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : recipient.status === 'Failed'
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : 'bg-gray-50 text-gray-500 border-gray-100'
                          }`}>
                            {recipient.status}
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
      </main>
    </div>
  );
}
