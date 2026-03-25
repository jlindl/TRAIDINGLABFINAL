"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Beaker, 
  History, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert,
  Sliders,
  CreditCard
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { SUPPORTED_INDICATORS } from "@/lib/backtest/schema";

export default function SettingsView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"profile" | "lab" | "engine">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [profileData, setProfileData] = useState<any>({
    full_name: "",
    avatar_url: ""
  });

  const [settings, setSettings] = useState<any>({
    lab_assistant: {
        personality: "Analytical",
        risk_tolerance: "Medium",
        custom_instructions: ""
    },
    backtesting_defaults: {
        indicators: {},
        risk: {
            tpPct: 0.05,
            slPct: 0.02
        }
    }
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      // If we don't have a user, we can't fetch but we MUST stop loading 
      // otherwise the page hangs on a black spinner.
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, settings")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching settings:", error.message || error);
        } else if (profile) {
          setProfileData({
            full_name: profile.full_name || "",
            avatar_url: profile.avatar_url || ""
          });
          if (profile.settings) {
            setSettings(profile.settings);
          }
        } else {
          console.warn("No profile found for user:", user.id);
        }
      } catch (err) {
        console.error("Critical settings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [supabase, user?.id]);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ 
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          settings 
        })
        .eq("id", user.id);

      if (error) throw error;
      setMsg({ type: "success", text: "Cloud profile synchronized successfully." });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neon border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-neon" />
            Control Center
          </h2>
          <p className="text-sm text-white/40 mt-1">Manage your identity, Lab Assistant intelligence, and engine protocols.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-neon text-black font-bold text-sm shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <div className="h-4 w-4 animate-spin border-2 border-black border-t-transparent rounded-full" /> : <Save className="h-4 w-4" />}
          {saving ? "SYNCING..." : "SAVE CHANGES"}
        </button>
      </div>

      {msg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
            msg.type === "success" ? "bg-neon/10 border-neon/20 text-neon" : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">{msg.text}</span>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 w-fit mb-10">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "profile" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
          }`}
        >
          <User className="h-4 w-4" />
          Identity
        </button>
        <button
          onClick={() => setActiveTab("lab")}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "lab" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
          }`}
        >
          <Beaker className="h-4 w-4" />
          Lab Assistant
        </button>
        <button
          onClick={() => setActiveTab("engine")}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "engine" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
          }`}
        >
          <History className="h-4 w-4" />
          Backtesting Engine
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "profile" ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="glass-edge p-8 bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-8">
                <User className="h-5 w-5 text-neon" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Public Identity</h3>
              </div>
              
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-neon focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Avatar URL</label>
                  <input 
                    type="text"
                    value={profileData.avatar_url}
                    onChange={(e) => setProfileData({ ...profileData, avatar_url: e.target.value })}
                    placeholder="https://your-avatar-image.url"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-neon focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="glass-edge p-8 bg-neon/[0.02] border-neon/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neon/10 border border-neon/20">
                    <CreditCard className="h-6 w-6 text-neon" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">Subscription & Billing</h3>
                    <p className="text-[11px] text-white/40 mt-1 uppercase tracking-widest font-mono">Current Tier: <span className="text-neon font-bold">Pro Trader</span></p>
                  </div>
                </div>
                
                {user?.plan === "pro_trader" ? (
                  <a 
                    href="/api/checkout/portal"
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group"
                  >
                    Manage Billing
                    <div className="h-1 w-1 rounded-full bg-neon group-hover:scale-150 transition-transform" />
                  </a>
                ) : (
                  <button 
                    onClick={() => {
                        // We need a way to open the modal from here. 
                        // Since SettingsView is a child, we'll use a custom event or redirect
                        window.location.href = "/dashboard?showUpgrade=true";
                    }}
                    className="px-6 py-3 rounded-xl bg-neon text-black text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : activeTab === "lab" ? (
          <motion.div
            key="lab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="glass-edge p-8 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="h-5 w-5 text-neon" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">AI Personality & Tone</h3>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                    {["Analytical", "Aggressive", "Conservative"].map((personality) => (
                        <button
                            key={personality}
                            onClick={() => setSettings({ ...settings, lab_assistant: { ...settings.lab_assistant, personality } })}
                            className={`p-6 rounded-2xl border transition-all text-left group ${
                                settings.lab_assistant.personality === personality 
                                ? "bg-neon/10 border-neon/40 shadow-[0_0_30px_rgba(0,255,136,0.05)]" 
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                        >
                            <span className={`text-xs font-bold uppercase tracking-widest mb-2 block ${
                                settings.lab_assistant.personality === personality ? "text-neon" : "text-white/20"
                            }`}>
                                {personality}
                            </span>
                            <p className="text-xs text-white/40 leading-relaxed">
                                {personality === "Analytical" && "Prioritizes deep technical justification and multiple indicator confirmation."}
                                {personality === "Aggressive" && "Focuses on high-frequency setups and trend breakouts with tighter stops."}
                                {personality === "Conservative" && "Emphasizes long-term trend stability and capital preservation above all."}
                            </p>
                        </button>
                    ))}
                </div>

                <div className="mt-10">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 block">Custom System Instructions</label>
                    <textarea 
                        value={settings.lab_assistant.custom_instructions}
                        onChange={(e) => setSettings({ ...settings, lab_assistant: { ...settings.lab_assistant, custom_instructions: e.target.value } })}
                        placeholder="e.g. Always assume I'm trading the London/NY overlap. Prefer RSI(9) over RSI(14)..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white/80 focus:border-neon focus:outline-none transition-all h-32 custom-scrollbar"
                    />
                </div>
            </div>

            <div className="glass-edge p-8 bg-red-500/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                    <ShieldAlert className="h-5 w-5 text-red-400" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Default Risk Tolerance</h3>
                </div>
                <div className="flex items-center gap-4">
                    {["Low", "Medium", "High"].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setSettings({ ...settings, lab_assistant: { ...settings.lab_assistant, risk_tolerance: lvl } })}
                            className={`flex-1 py-4 rounded-xl border text-sm font-bold transition-all ${
                                settings.lab_assistant.risk_tolerance === lvl
                                ? "bg-red-500/20 border-red-500/40 text-red-400"
                                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                            }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>
          </motion.div>
        ) : activeTab === "engine" ? (
          <motion.div
            key="engine"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="glass-edge p-8 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                    <Sliders className="h-5 w-5 text-neon" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Global Indicator Defaults</h3>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {SUPPORTED_INDICATORS.filter(i => Object.keys(i.params).length > 0).slice(0, 9).map((ind) => (
                        <div key={ind.code} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-[10px] font-mono text-neon/60 uppercase mb-2 block">{ind.code}</span>
                            <div className="space-y-3">
                                {Object.entries(ind.params).map(([key, param]: [string, any]) => (
                                    <div key={key} className="flex flex-col gap-1.5">
                                        <label className="text-[10px] text-white/20 uppercase font-bold">{param.label}</label>
                                        <input 
                                            type="number"
                                            value={settings.backtesting_defaults.indicators[ind.code]?.[key] ?? param.default}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                const newIndSettings = { ...settings.backtesting_defaults.indicators };
                                                newIndSettings[ind.code] = { ...newIndSettings[ind.code], [key]: val };
                                                setSettings({ 
                                                    ...settings, 
                                                    backtesting_defaults: { 
                                                        ...settings.backtesting_defaults, 
                                                        indicators: newIndSettings 
                                                    } 
                                                });
                                            }}
                                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-neon focus:border-neon focus:outline-none transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-white/20 mt-6 italic">Showing primary indicators. More defaults can be configured via strategy exports.</p>
            </div>

            <div className="glass-edge p-8 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                    <History className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Standard Risk Parameters</h3>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Default Take Profit (%)</label>
                        <input 
                            type="number"
                            step="0.01"
                            value={settings.backtesting_defaults.risk.tpPct}
                            onChange={(e) => setSettings({ 
                                ...settings, 
                                backtesting_defaults: { 
                                    ...settings.backtesting_defaults, 
                                    risk: { ...settings.backtesting_defaults.risk, tpPct: parseFloat(e.target.value) } 
                                } 
                            })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-neon focus:border-neon focus:outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Default Stop Loss (%)</label>
                        <input 
                            type="number"
                            step="0.01"
                            value={settings.backtesting_defaults.risk.slPct}
                            onChange={(e) => setSettings({ 
                                ...settings, 
                                backtesting_defaults: { 
                                    ...settings.backtesting_defaults, 
                                    risk: { ...settings.backtesting_defaults.risk, slPct: parseFloat(e.target.value) } 
                                } 
                            })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-neon focus:border-neon focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
