import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white font-bold">
              K
            </div>
            <h1 className="text-xl font-bold text-gray-900">Karta AI</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/campaigns" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Campaigns
            </Link>
            <p className="text-sm text-gray-600">AI-Powered Chat System</p>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Welcome to Karta AI
              </h2>
              <p className="text-lg text-gray-600">
                Your intelligent assistant is ready to help. Click the chat button in the bottom-right corner to get started.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-6 border border-blue-200">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Getting Started - Try These Commands:
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">General Help:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• <code className="rounded bg-white px-2 py-1 border border-blue-200">"hello"</code> - Start a conversation</li>
                      <li>• <code className="rounded bg-white px-2 py-1 border border-blue-200">"help"</code> - Get help and guidance</li>
                      <li>• <code className="rounded bg-white px-2 py-1 border border-blue-200">"features"</code> - Learn about Karta AI</li>
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Campaign Creation:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• <code className="rounded bg-white px-2 py-1 border border-green-200">"create campaign"</code> - Launch campaign wizard</li>
                      <li>• <code className="rounded bg-white px-2 py-1 border border-green-200">"new campaign"</code> - Start a new email/SMS campaign</li>
                      <li>• <code className="rounded bg-white px-2 py-1 border border-green-200">"campaign"</code> - Get campaign creation help</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                <div className="rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
                  <div className="mb-2 text-2xl">💬</div>
                  <h4 className="font-semibold text-gray-900">Chat</h4>
                  <p className="text-xs text-gray-600">Real-time conversation</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
                  <div className="mb-2 text-2xl">⚡</div>
                  <h4 className="font-semibold text-gray-900">Actions</h4>
                  <p className="text-xs text-gray-600">Smart automation</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
                  <div className="mb-2 text-2xl">🎯</div>
                  <h4 className="font-semibold text-gray-900">Campaigns</h4>
                  <p className="text-xs text-gray-600">Email & SMS marketing</p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
                <h3 className="mb-3 font-semibold text-gray-900">Installation & Setup</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>This project is ready to run. Simply:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-2">
                    <li>Install dependencies: <code className="rounded bg-white px-2 py-1 border border-gray-300">npm install</code> or <code className="rounded bg-white px-2 py-1 border border-gray-300">pnpm install</code></li>
                    <li>Start the dev server: <code className="rounded bg-white px-2 py-1 border border-gray-300">npm run dev</code></li>
                    <li>Open the chat: Click the blue chat button in the bottom-right corner</li>
                    <li>Try a command: Type "create campaign" to open the campaign wizard</li>
                  </ol>
                  <p className="pt-2 text-xs text-gray-600 italic">The chat supports smart actions and can open modals, navigate, and trigger complex workflows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
