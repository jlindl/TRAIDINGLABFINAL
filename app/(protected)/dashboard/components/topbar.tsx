"use client";

import { Bell, Search, Zap, User } from "lucide-react";

interface TopbarProps {
  user: any;
}

export default function Topbar({ user }: TopbarProps) {
  const planStyles: Record<string, string> = {
    "paper_trader": "text-blue-400 border-blue-500/20 bg-blue-500/10",
    "pro_trader": "text-neon border-neon/20 bg-neon/10",
    "admin": "text-violet-400 border-violet-500/20 bg-violet-500/10",
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#050505]/30 px-6 lg:px-10 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative group max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 group-focus-within:text-neon transition-colors" />
          <input 
            type="text" 
            placeholder="Search strategies, docs, or bots..." 
            className="w-full rounded-xl bg-white/5 border border-white/5 px-10 py-2 text-xs text-white placeholder:text-white/20 focus:border-neon/30 focus:outline-none transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-white/20">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex h-2 w-2 rounded-full bg-neon animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-neon/80">
            Live Mainnet
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all hover:bg-white/10">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
          
          <div className="flex items-center gap-3 pl-3 border-l border-white/5">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-white">{user?.email?.split('@')[0]}</span>
              <span className={`text-[9px] font-mono px-1.5 rounded-full border ${planStyles[user?.plan] || planStyles["Free"]}`}>
                {(user?.plan || "Free").toUpperCase()}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon/10 border border-neon/20 p-1">
               <User className="h-5 w-5 text-neon" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
