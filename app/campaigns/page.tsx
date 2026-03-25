'use client';

import Link from 'next/link';

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
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-200">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white font-bold transition-transform group-hover:scale-105">
              K
            </div>
            <span className="text-lg font-bold tracking-tight">Karta AI</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Back to Home
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">Campaigns</h1>
            <p className="text-gray-500 max-w-lg">
              Precision targeting and real-time analytics for your high-end marketing operations.
            </p>
          </div>
          <Link href="/campaigns/create">
            <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center gap-2">
              <span>+</span>
              <span>Create Campaign</span>
            </button>
          </Link>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Campaign</th>
                  <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Type</th>
                  <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Recipients</th>
                  <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Status</th>
                  <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Date</th>
                  <th className="px-8 py-5 text-xs font-bold tracking-widest uppercase text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-gray-900">{campaign.name}</td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{campaign.type}</td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{campaign.recipients.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-lg border ${
                          campaign.status === 'Active'
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-500 border-gray-200'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-400 font-medium">{campaign.created}</td>
                    <td className="px-8 py-6">
                      <button className="text-gray-400 hover:text-gray-900 font-bold text-xs tracking-widest uppercase transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty state info */}
        <div className="mt-12 p-10 rounded-xl border border-dashed border-gray-200 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Ready to scale? <Link href="/campaigns/create" className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors">Start your next campaign</Link> or <Link href="/" className="text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors">return to dashboard</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
