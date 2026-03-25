"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white font-bold transition-transform group-hover:scale-105">
            K
          </div>
          <span className="text-lg font-bold tracking-tight">Karta AI</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/campaigns"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Campaigns
          </Link>
          <button className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-95">
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
};
