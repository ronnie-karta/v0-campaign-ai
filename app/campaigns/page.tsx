'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CampaignsPage() {
  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale 2024',
      type: 'Email',
      recipients: 5240,
      status: 'Active',
      created: '2024-03-15',
    },
    {
      id: 2,
      name: 'Product Launch',
      type: 'Email & SMS',
      recipients: 2100,
      status: 'Scheduled',
      created: '2024-03-10',
    },
    {
      id: 3,
      name: 'Holiday Promotion',
      type: 'SMS',
      recipients: 8900,
      status: 'Completed',
      created: '2024-02-20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Campaigns</h1>
            <p className="text-gray-600">Manage and create your marketing campaigns</p>
          </div>
          <Link href="/campaigns/create">
            <Button className="bg-purple-600 hover:bg-purple-700 px-6">
              + New Campaign
            </Button>
          </Link>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Campaign Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Recipients</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={campaign.id} className={index !== campaigns.length - 1 ? 'border-b' : ''}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{campaign.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{campaign.recipients.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'Scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{campaign.created}</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-purple-600 hover:text-purple-800 font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-900">
            Ready to create your first campaign? Click the "New Campaign" button to get started!
          </p>
        </div>
      </div>
    </div>
  );
}
