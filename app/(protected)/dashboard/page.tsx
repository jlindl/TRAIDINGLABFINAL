"use client";

import { Suspense, useState, useEffect } from "react";
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
import FeedbackView from "./components/feedback-view";
import UpgradeModal from "./components/upgrade-modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
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
  | "settings"
  | "feedback";

function DashboardContent() {
  const [activeView, setActiveView] = useState<DashboardView>("lab-assistant");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle ?showUpgrade=true redirect from Billing Portal
  useEffect(() => {
    if (searchParams.get("showUpgrade") === "true") {
      setIsUpgradeModalOpen(true);
      // Clean URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("showUpgrade");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) setIsSidebarCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  useEffect(() => {
    const fetchUser = async (retryCount = 0) => {
      try {
        // Quick session check first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (retryCount < 2) {
            // Give Supabase a moment to persist the session after redirect
            console.log(`No session found, retry ${retryCount + 1}...`);
            setTimeout(() => fetchUser(retryCount + 1), 500);
            return;
          }
          console.warn("No session after retries, redirecting to login.");
          router.push("/login");
          return;
        }

        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/login");
          return;
        }
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("tier")
          .eq("id", authUser.id)
          .single();
          
        const plan = profile?.tier || "paper_trader";
        setUser({ ...authUser, plan });
        setLoading(false);

        // Trigger Upgrade Modal if Paper Trader and not shown this session
        const hasSeenModal = sessionStorage.getItem("has-seen-upgrade-modal");
        if (plan === "paper_trader" && !hasSeenModal) {
          setTimeout(() => {
            setIsUpgradeModalOpen(true);
            sessionStorage.setItem("has-seen-upgrade-modal", "true");
          }, 1500); 
        }
      } catch (err) {
        console.error("Dashboard fetchUser failed:", err);
        router.push("/login");
      }
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
          onUpgrade={() => setIsUpgradeModalOpen(true)}
          onRunBacktest={async (strategy) => {
            try {
              const res = await fetch("/api/usage/backtest", { method: "POST" });
              if (res.status === 429) {
                const data = await res.json();
                setIsUpgradeModalOpen(true); // Trigger modal on backtest quota too
                return;
              }
              setSelectedStrategy(strategy);
              setActiveView("backtesting");
            } catch (err) {
              console.error("Quota check failed. Proceeding anyway...", err);
              setSelectedStrategy(strategy);
              setActiveView("backtesting");
            }
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
      case "settings": return <SettingsView user={user} />;
      case "feedback": return <FeedbackView user={user} />;
      default: return <BotsView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white selection:bg-neon/30">
      {/* Background Grid */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-10" />

      <motion.aside
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        className="relative z-20 hidden lg:flex h-full flex-col border-r border-white/5 bg-[#050505]/50 backdrop-blur-xl"
      >
        <Sidebar 
          user={user}
          activeView={activeView} 
          onViewChange={setActiveView} 
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </motion.aside>

      <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 custom-scrollbar">
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

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon border-t-transparent" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
