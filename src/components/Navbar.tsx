'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  Radio, 
  LogOut,
  Lock
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render minimal header
  if (pathname === '/login') {
    return (
      <header className="bg-white border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-base">FONDSNYT // OVERBLIK</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Adgangskodebeskyttet</span>
          </div>
        </div>
      </header>
    );
  }

  const navItems = [
    { href: '/', label: 'Oversigt', icon: LayoutDashboard },
    { href: '/puljer', label: 'Fonde & Puljer', icon: Search },
    { href: '/overvaagning', label: 'Kildeovervågning', icon: Radio },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo & tagline */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-slate-800 transition-colors">
                F
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tracking-tight text-lg">FONDSNYT</span>
                  <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">DK & EU</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Automatiseret Fondsovervågning</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* System status pill & Logout */}
          <div className="flex items-center gap-3">
            <Link
              href="/puljer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-all"
            >
              <Search className="w-3.5 h-3.5 text-slate-300" />
              <span>Find Puljer</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Lås dashboard / Log ud"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
