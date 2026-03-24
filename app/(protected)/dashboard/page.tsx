"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import BotsView from "./components/bots-view";
import MarketplaceView from "./components/marketplace-view";
import GhostWriterView from "./components/ghost-writer-view";
import LabAssistantView from "./components/lab-assistant-view";
import DevPortalView from "./components/dev-portal-view";
import BacktestingView from "./components/backtesting-view";
import DeploymentView from "./components/deployment-view";
import HelpView from "./components/help-view";
import SavedStrategiesView from "./components/strategies/saved-strategies-view";
import SettingsView from "./components/settings-view";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type DashboardView = 
  | "bots" 
  | "marketplace" 
  | "ghost-writer" 
  | "lab-assistant" 
  | "dev-portal" 
  | "backtesting" 
  | "deployment" 
  | "saved-strategies"
  | "help"
  | "settings";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<DashboardView>("lab-assistant");
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push("/login");
        return;
      }
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", authUser.id)
        .single();
        
      setUser({ ...authUser, plan: profile?.plan || "Free" });
      setLoading(false);
    };

    fetchUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon border-t-transparent" />
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case "bots": return <BotsView />;
      case "marketplace": return <MarketplaceView />;
      case "ghost-writer": return <GhostWriterView />;
      case "lab-assistant": return (
        <LabAssistantView 
          onRunBacktest={(strategy) => {
            setSelectedStrategy(strategy);
            setActiveView("backtesting");
          }} 
        />
      );
      case "dev-portal": return <DevPortalView />;
      case "backtesting": return <BacktestingView initialStrategy={selectedStrategy} onClearInitial={() => setSelectedStrategy(null)} />;
      case "deployment": return <DeploymentView />;
      case "saved-strategies": return (
        <SavedStrategiesView 
          onSelectStrategy={(strategy) => {
            setSelectedStrategy(strategy);
            setActiveView("backtesting");
          }} 
        />
      );
      case "help": return <HelpView />;
      case "settings": return <SettingsView />;
      default: return <BotsView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white selection:bg-neon/30">
      {/* Background Grid */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-10" />

      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
