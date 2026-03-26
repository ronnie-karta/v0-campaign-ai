import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 font-sans selection:bg-gray-200">
      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              The intelligent spine for your enterprise.
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              A premium AI-powered automation system designed for elite professional environments. 
              Manage high-scale campaigns and complex workflows with absolute precision.
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

        {/* Capabilities Section */}
        <section className="bg-gray-50 py-24 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Intelligence</div>
                <h3 className="text-2xl font-bold tracking-tight">Adaptive Learning</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Our system evolves with your organization, automating repetitive tasks while maintaining institutional knowledge.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Automation</div>
                <h3 className="text-2xl font-bold tracking-tight">Precision Dispatch</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Advanced action dispatching system that translates complex user intent into seamless multi-step UI workflows.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Scale</div>
                <h3 className="text-2xl font-bold tracking-tight">Enterprise Reach</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Engineered to handle massive campaign volumes across SMS and Email with real-time performance tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Engineered for clarity.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We've stripped away the noise to focus on what matters most: your workflow and results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'AI Automation', desc: 'Natural language interface for complex enterprise operations.', icon: '🤖' },
              { title: 'Campaigns', desc: 'Precision email and SMS marketing with real-time analytics.', icon: '🎯' },
              { title: 'Workflows', desc: 'Intelligent multi-step actions based on organizational needs.', icon: '⚡' },
              { title: 'Insights', desc: 'Deep analytics into campaign performance and automation ROI.', icon: '📊' },
              { title: 'Security', desc: 'Enterprise-grade protection for your data and communications.', icon: '🔒' },
              { title: 'Connectivity', desc: 'Seamless integration with your existing professional tools.', icon: '🔌' }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all hover:scale-[1.02] shadow-sm">
                <div className="text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Commands Section */}
        <section className="py-24 max-w-6xl mx-auto px-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3 space-y-6">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Interface</div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Command the system with natural language.
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Jules, your Karta AI assistant, translates your intent directly into professional UI actions. 
                Try these commands in the chat widget to experience high-scale automation.
              </p>
              <div className="pt-4">
                <Link 
                  href="/campaigns/create"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm"
                >
                  Start Campaign
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { 
                  category: 'Campaign Creation', 
                  commands: [
                    'create campaign for Nike budget 5000',
                    'Adidas campaign budget 3000'
                  ]
                },
                { 
                  category: 'Audience & Content', 
                  commands: [
                    'send to 200 users',
                    'set message promo sale 50% off'
                  ]
                },
                { 
                  category: 'Scheduling & Delivery', 
                  commands: [
                    'schedule tomorrow',
                    'deliver on 2026-03-26'
                  ]
                },
                { 
                  category: 'System & Navigation', 
                  commands: [
                    'help',
                    'navigate to campaigns',
                    'hello'
                  ]
                }
              ].map((group, i) => (
                <div key={i} className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">{group.category}</h4>
                  <div className="space-y-2">
                    {group.commands.map((cmd, j) => (
                      <div key={j} className="flex items-center gap-2 group cursor-pointer">
                        <code className="text-[13px] bg-white border border-gray-200 px-3 py-1.5 rounded-md text-gray-700 font-mono flex-1 group-hover:border-gray-900 transition-colors">
                          "{cmd}"
                        </code>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gray-50 py-32 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing.</h2>
              <p className="text-gray-500">Professional plans engineered for scale.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { name: 'Starter', price: '0', feat: ['100 Automation Tasks/mo', 'Basic Campaigns', 'Community Support'] },
                { name: 'Professional', price: '99', feat: ['Unlimited Tasks', 'Advanced Campaigns', 'Priority Support', 'Custom Workflows'], highlighted: true },
                { name: 'Enterprise', price: '499', feat: ['Custom Architecture', 'Dedicated Support', 'Full API Access', 'SLA Guarantees'] }
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
                    Select Plan
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
            © 2026 Karta AI. Engineered for the modern enterprise.
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
