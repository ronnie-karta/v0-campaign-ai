import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 font-sans selection:bg-gray-200">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white font-bold transition-transform group-hover:scale-105">
              K
            </div>
            <span className="text-lg font-bold tracking-tight">Karta AI</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/campaigns" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Campaigns
            </Link>
            <button className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-95">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              The intelligent spine for your workspace.
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              A premium AI-powered system designed for modern environments. 
              Seamlessly manage campaigns, status, and communication with absolute clarity.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
                Open Dashboard
              </button>
              <button className="border border-gray-300 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]">
                View Documentation
              </button>
            </div>
          </div>
        </section>

        {/* Status Grid Section */}
        <section className="bg-gray-50 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Workspace Status</h2>
                <p className="text-gray-500">Real-time occupancy and performance monitoring.</p>
              </div>
              <div className="flex gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  <span className="text-gray-500">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                  <span className="text-gray-900">In Use</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className={`p-6 rounded-xl border transition-all hover:scale-[1.02] cursor-default shadow-sm ${
                    i % 3 === 0 
                    ? 'bg-gray-900 border-gray-900 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  <span className="text-xs font-bold opacity-50 block mb-1">STATION</span>
                  <span className="text-2xl font-bold tracking-tight">{String(i + 1).padStart(2, '0')}</span>
                  <div className="mt-4 pt-4 border-t border-current opacity-10 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                    <span>{i % 3 === 0 ? 'Busy' : 'Free'}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-white' : 'bg-gray-900'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Engineered for clarity.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We've stripped away the noise to focus on what matters most: your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'AI Chat', desc: 'Natural language interface for complex system operations.', icon: '💬' },
              { title: 'Campaigns', desc: 'Precision email and SMS marketing with real-time tracking.', icon: '🎯' },
              { title: 'Automation', desc: 'Intelligent action dispatching based on user behavior.', icon: '⚡' },
              { title: 'Analytics', desc: 'Deep insights into workspace usage and campaign performance.', icon: '📊' },
              { title: 'Security', desc: 'Enterprise-grade protection for your data and communications.', icon: '🔒' },
              { title: 'Integration', desc: 'Connect with your existing tools through our robust API.', icon: '🔌' }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all hover:scale-[1.02] shadow-sm">
                <div className="text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gray-50 py-32 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing.</h2>
              <p className="text-gray-500">Choose the plan that fits your scale.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { name: 'Starter', price: '0', feat: ['100 Messages/mo', 'Basic Campaigns', 'Community Support'] },
                { name: 'Professional', price: '49', feat: ['Unlimited Messages', 'Advanced Campaigns', 'Priority Support', 'Custom Actions'], highlighted: true },
                { name: 'Enterprise', price: '199', feat: ['Everything in Pro', 'Custom Branding', 'API Access', '24/7 Dedicated Support'] }
              ].map((p, i) => (
                <div 
                  key={i} 
                  className={`p-10 rounded-xl border transition-all hover:scale-[1.02] shadow-sm flex flex-col ${
                    p.highlighted 
                    ? 'bg-white border-gray-900 border-2' 
                    : 'bg-white border-gray-200'
                  }`}
                >
                  <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold tracking-tight">${p.price}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {p.feat.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-medium transition-all active:scale-95 ${
                    p.highlighted 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}>
                    Choose Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 max-w-6xl mx-auto px-6 border-t border-gray-100 w-full text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white font-bold">
            K
          </div>
          <p className="text-sm text-gray-400">
            © 2026 Karta AI. Built for the modern professional.
          </p>
          <div className="flex gap-8 text-xs font-medium text-gray-400">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
