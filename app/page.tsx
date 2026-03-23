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
          <p className="text-sm text-gray-600">AI-Powered Chat System</p>
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
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Try These Commands:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Say <code className="rounded bg-gray-200 px-2 py-1">"hello"</code> to start</li>
                  <li>• Ask about <code className="rounded bg-gray-200 px-2 py-1">"features"</code> to see what I can do</li>
                  <li>• Say <code className="rounded bg-gray-200 px-2 py-1">"help"</code> for assistance</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 p-4 text-center">
                  <div className="mb-2 text-2xl">💬</div>
                  <h4 className="font-semibold text-gray-900">Chat</h4>
                  <p className="text-xs text-gray-600">Real-time conversation</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center">
                  <div className="mb-2 text-2xl">⚡</div>
                  <h4 className="font-semibold text-gray-900">Actions</h4>
                  <p className="text-xs text-gray-600">Smart automation</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 text-center">
                  <div className="mb-2 text-2xl">🎯</div>
                  <h4 className="font-semibold text-gray-900">Global</h4>
                  <p className="text-xs text-gray-600">Always available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
