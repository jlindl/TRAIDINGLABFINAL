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
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { DashboardView } from "../page";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  user: any;
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const liveItems = [
  { id: "lab-assistant", label: "Lab Assistant", icon: Beaker },
  { id: "backtesting", label: "Backtesting", icon: History },
  { id: "saved-strategies", label: "Saved Strategies", icon: Save },
  { id: "help", label: "Help Center", icon: CircleHelp },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

const pendingItems = [
  { id: "bots", label: "Live Bots", icon: Cpu },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "ghost-writer", label: "Ghost Writer", icon: Ghost },
  { id: "dev-portal", label: "Developer", icon: Code2 },
  { id: "deployment", label: "Deployment", icon: Cloud },
];

export default function Sidebar({ user, activeView, onViewChange, isCollapsed, onToggle }: SidebarProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const renderNavGroup = (items: typeof liveItems, title: string, isPending: boolean = false) => (
    <div className="space-y-1">
      {!isCollapsed && (
        <div className="mb-2 px-4 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">{title}</span>
          {isPending && (
            <div className="h-1 w-1 rounded-full bg-white/10" />
          )}
        </div>
      )}
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
            } ${isPending && !isActive ? "opacity-60 grayscale-[0.5]" : ""} ${isCollapsed ? "justify-center px-0" : ""}`}
            title={isCollapsed ? item.label : ""}
          >
            <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-neon" : "group-hover:text-neon"}`} />
            {!isCollapsed && <span className="flex-1 text-left whitespace-nowrap overflow-hidden">{item.label}</span>}
            
            {!isCollapsed && isPending && !isActive && (
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
    <div className="h-full flex flex-col relative">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-20 z-50 h-8 w-8 rounded-full bg-[#080808] border border-neon/30 flex items-center justify-center text-neon/40 hover:text-neon hover:border-neon shadow-[0_0_15px_rgba(0,255,136,0.1)] hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className={`flex h-16 items-center border-b border-white/5 transition-all ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
        <Link href="/" className="group flex items-center gap-2.5">
          <img 
            src="/Logo.png" 
            alt="TraidingLab Logo" 
            className={`h-10 w-auto object-contain transition-all duration-300 ${isCollapsed ? "w-8 scale-[2] translate-x-1" : "w-auto group-hover:scale-110 origin-left"}`} 
            style={{ minWidth: isCollapsed ? '32px' : '140px' }}
          />
        </Link>
      </div>

      <div className={`relative flex-1 space-y-8 p-4 overflow-y-auto custom-scrollbar transition-all ${isCollapsed ? "px-2" : "p-4"}`}>
        {renderNavGroup(liveItems, "Terminal")}
        {renderNavGroup(pendingItems, "Roadmap", true)}
      </div>

      <div className={`p-4 flex flex-col gap-2 border-t border-white/5 transition-all ${isCollapsed ? "px-2" : "p-4"}`}>
        {user?.plan === "pro_trader" && (
          <a
            href="/api/checkout/portal"
            className={`group flex items-center gap-3 rounded-xl py-2.5 text-xs font-bold text-neon/40 hover:bg-neon/5 hover:text-neon transition-all ${isCollapsed ? "justify-center px-0" : "px-4"}`}
            title={isCollapsed ? "Manage Billing" : ""}
          >
            <Zap className="h-4 w-4 shrink-0 transition-colors" />
            {!isCollapsed && <span>Manage Billing</span>}
          </a>
        )}

        <button
          onClick={handleLogout}
          className={`group flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all ${isCollapsed ? "justify-center px-0" : "px-4"}`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="h-4 w-4 shrink-0 group-hover:text-red-400 transition-colors" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {!isCollapsed && (
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
        )}
      </div>
    </div>
  );
}
