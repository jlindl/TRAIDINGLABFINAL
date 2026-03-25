"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Zap, ShieldCheck, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import StripeCheckout from "@/app/components/stripe-checkout";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setShowCheckout(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#080808] shadow-[0_0_50px_rgba(0,0,0,0.5)] custom-scrollbar"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-neon/10 blur-[80px]" />
            
            <div className="relative p-8">
              <button 
                onClick={onClose}
                className="absolute right-6 top-6 text-white/20 hover:text-white transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <AnimatePresence mode="wait">
                {!showCheckout ? (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon/10 border border-neon/20">
                        <Sparkles className="h-5 w-5 text-neon" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon/60">Institutional Upgrade</span>
                    </div>

                    <h2 className="text-3xl font-black text-white tracking-tighter mb-4 leading-tight">
                      Unlock the Full <br/>Quant-Leap Potential.
                    </h2>
                    
                    <p className="text-sm text-white/40 mb-8 leading-relaxed">
                      You're currently using the <span className="text-white font-bold">Paper Trader</span> trial. 
                      Upgrade to Pro to remove research bottlenecks and access institutional indicators.
                    </p>

                    <div className="space-y-4 mb-10">
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Unrestricted Research</h4>
                          <p className="text-[11px] text-white/40 mt-1">40 AI Sessions per day. No more halting your flow mid-discovery.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neon/10 text-neon">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Elite SMC Suite</h4>
                          <p className="text-[11px] text-white/40 mt-1">Access FVG, Order Blocks, and Multi-Timeframe Institutional trend filters.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Strategy Persistence</h4>
                          <p className="text-[11px] text-white/40 mt-1">Save unlimited strategy contracts and recall them for live backtesting.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => setShowCheckout(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neon py-4 text-sm font-black text-black shadow-[0_0_30px_rgba(0,255,136,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        UPGRADE TO PRO TRADER — £49/MO
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={onClose}
                        className="w-full py-4 text-xs font-bold text-white/20 hover:text-white/40 transition-all uppercase tracking-widest"
                      >
                        Maybe Later
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="pt-2"
                  >
                    <button 
                      onClick={() => setShowCheckout(false)}
                      className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group"
                    >
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Back to Features</span>
                    </button>
                    
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tighter">
                      Complete Your Upgrade
                    </h3>

                    <StripeCheckout tier="pro" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Bottom Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-neon via-blue-500 to-purple-500 opacity-30" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
