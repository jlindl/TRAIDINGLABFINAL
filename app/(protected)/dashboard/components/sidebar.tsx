"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Cpu, 
  Store, 
  Ghost, 
  Beaker, 
  Code2, 
  History, 
  Cloud, 
  Zap, 
  CircleHelp,
  Save,
  Settings,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { DashboardView } from "../page";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const liveItems = [
  { id: "lab-assistant", label: "Lab Assistant", icon: Beaker },
  { id: "backtesting", label: "Backtesting", icon: History },
  { id: "saved-strategies", label: "Saved Strategies", icon: Save },
  { id: "help", label: "Help Center", icon: CircleHelp },
  { id: "settings", label: "Settings", icon: Settings },
];

const pendingItems = [
  { id: "bots", label: "Live Bots", icon: Cpu },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "ghost-writer", label: "Ghost Writer", icon: Ghost },
  { id: "dev-portal", label: "Developer", icon: Code2 },
  { id: "deployment", label: "Deployment", icon: Cloud },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const renderNavGroup = (items: typeof liveItems, title: string, isPending: boolean = false) => (
    <div className="space-y-1">
      <div className="mb-2 px-4 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">{title}</span>
        {isPending && (
          <div className="h-1 w-1 rounded-full bg-white/10" />
        )}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as DashboardView)}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              isActive 
                ? "bg-neon/10 text-white" 
                : "text-white/40 hover:bg-white/5 hover:text-white"
            } ${isPending && !isActive ? "opacity-60 grayscale-[0.5]" : ""}`}
          >
            <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-neon" : "group-hover:text-neon"}`} />
            <span className="flex-1 text-left">{item.label}</span>
            
            {isPending && !isActive && (
              <span className="text-[8px] font-mono text-white/10 group-hover:text-white/20 transition-colors uppercase tracking-widest">
                Soon
              </span>
            )}

            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 h-1/2 w-[2px] rounded-full bg-neon shadow-[0_0_8px_rgba(0,255,136,0.5)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="relative z-20 hidden w-64 flex-col border-r border-white/5 bg-[#050505]/50 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center border-b border-white/5 px-6">
        <Link href="/" className="group flex items-center gap-2.5 px-2">
          <img 
            src="/Logo.png" 
            alt="TraidingLab Logo" 
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110 origin-left" 
            style={{ minWidth: '140px' }}
          />
        </Link>
      </div>

      <div className="flex-1 space-y-8 p-4 overflow-y-auto custom-scrollbar">
        {renderNavGroup(liveItems, "Terminal")}
        {renderNavGroup(pendingItems, "Roadmap", true)}
      </div>

      <div className="p-4 flex flex-col gap-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all transition-all"
        >
          <LogOut className="h-4 w-4 group-hover:text-red-400 transition-colors" />
          Logout
        </button>

        <div className="glass-edge bg-white/[0.01] p-4 text-center">
          <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">System Load</div>
          <div className="flex items-center justify-center gap-1.5 overflow-hidden">
             {[...Array(12)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ scaleY: [1, Math.random() * 2 + 1, 1] }}
                 transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                 className="h-3 w-0.5 rounded-full bg-neon/40"
               />
             ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
