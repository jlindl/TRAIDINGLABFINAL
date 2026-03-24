"use client";

import { motion } from "framer-motion";
import { 
  Rocket, 
  ExternalLink, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Info, 
  ArrowRight,
  Plus,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";

const BrokerLogo = ({ id, className }: { id: string, className?: string }) => {
  if (id === 'bybit') return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M78.6,41.9c0,5.4-1.8,10.1-5,13.7c-3.1,3.4-7.5,5.1-12.2,5.1h-0.2V41.9h12.5C77.4,41.9,78.6,41.9,78.6,41.9z M73.7,50.4 c2.3-1.9,3.5-4.8,3.5-8.5H66v13.5h0.4C70,55.4,72.3,53.4,73.7,50.4z" />
      <path d="M47.8,60.7H10.1V39.3h37.7V60.7z M12.6,58.2h32.7V41.8H12.6V58.2z" />
      <path d="M51.9,39.3v21.4h26.7V39.3H51.9z M76.1,58.2H54.4V41.8h21.7V58.2z" />
    </svg>
  );
  if (id === 'okx') return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M20,20h15v15h-15V20z M42.5,20h15v15h-15V20z M65,20h15v15h-15V20z M20,42.5h15v15h-15V42.5z M42.5,42.5h15v15h-15V42.5z M65,42.5h15v15h-15V42.5z M20,65h15v15h-15V65z M42.5,65h15v15h-15V65z M65,65h15v15h-15V65z" />
    </svg>
  );
  if (id === 'binance') return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50,10L85,45L50,80L15,45L50,10z M50,25L70,45L50,65L30,45L50,25z M10,45L25,30V60L10,45z M90,45L75,30V60L90,45z M50,90L40,80H60L50,90z M50,0L40,10H60L50,0z" />
    </svg>
  );
  if (id === 'alpaca') return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50,10c5,0,10,3,10,15s-5,25-10,25s-10-13-10-25S45,10,50,10z M60,60c10,5,20,15,20,25H20c0-10,10-20,20-25C43,62,57,62,60,60z" />
    </svg>
  );
  return null;
};

const BROKERS = [
  { 
    id: 'bybit', 
    name: 'Bybit', 
    description: 'The #1 bot-friendly exchange. High liquidity and aggressive 50% affiliate rebates.',
    referralLink: 'https://www.bybit.com/register?affiliate_id=YOUR_ID_HERE'
  },
  { 
    id: 'okx', 
    name: 'OKX', 
    description: 'Advanced V5 API architecture. Home to 900k+ active bot traders worldwide.',
    referralLink: 'https://www.okx.com/join/YOUR_REF_HERE'
  },
  { 
    id: 'alpaca', 
    name: 'Alpaca', 
    description: 'Regulated US Stocks & Crypto. The gold standard for API-first algorithmic trading.',
    referralLink: 'https://alpaca.markets/signup?ref=YOUR_REF_HERE'
  },
  { 
    id: 'binance', 
    name: 'Binance', 
    description: 'The global giant. Deepest order books and massive asset selection.',
    referralLink: 'https://www.binance.com/en/register?ref=YOUR_REF_HERE'
  }
];

export default function DeploymentView() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [selectedStrategyId, setSelectedStrategyId] = useState("");
  const [selectedBroker, setSelectedBroker] = useState(BROKERS[0].id);
  const [brokerUid, setBrokerUid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stratRes, depRes] = await Promise.all([
          fetch("/api/strategies"),
          fetch("/api/deployments")
        ]);
        
        if (!stratRes.ok || !depRes.ok) throw new Error("Failed to load data");
        
        const [strats, deps] = await Promise.all([stratRes.json(), depRes.json()]);
        setStrategies(strats);
        setDeployments(deps);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateDeployment = async () => {
    if (!selectedStrategyId || !brokerUid) {
      alert("Please select a strategy and provide your Broker UID.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy_id: selectedStrategyId,
          broker: selectedBroker,
          broker_uid: brokerUid
        })
      });

      if (!res.ok) throw new Error("Failed to start deployment");
      
      const newDep = await res.json();
      setDeployments([newDep, ...deployments]);
      setSelectedStrategyId("");
      setBrokerUid("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadScript = async (stratId: string, broker: string) => {
    try {
      const res = await fetch("/api/deployments/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy_id: stratId, broker })
      });

      if (!res.ok) throw new Error("Failed to generate script");
      
      const { script, filename } = await res.json();
      
      // Create blob and download
      const blob = new Blob([script], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      // Refresh deployments to show 'exported' status
      const depUpdate = await fetch("/api/deployments").then(r => r.json());
      setDeployments(depUpdate);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 pb-10 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] mb-4"
        >
          <Rocket className="h-3 w-3 animate-bounce" />
          Mission Control: Pre-Flight
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-bold text-white tracking-tighter"
        >
          Live Deployment <span className="text-white/20">Coming Soon.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed"
        >
          We are finalizing our institutional-grade execution environment. 
          Soon, you'll be able to deploy complex strategies to the cloud with a single click.
        </motion.p>
      </div>

      {/* Capabilities Grid */}
      <div className="grid gap-6 md:grid-cols-2 w-full px-4">
        {[
          {
            title: "TraidingLab Cloud Engine",
            desc: "One-click deployment to our high-performance cloud clusters. 99.9% uptime with redundant failover protection.",
            icon: <Download className="h-5 w-5 text-neon" />,
            color: "border-neon/20 bg-neon/5"
          },
          {
            title: "Native Broker Integrations",
            desc: "Direct, high-speed API connections to Bybit, OKX, and Binance. No secondary scripts required for execution.",
            icon: <ShieldCheck className="h-5 w-5 text-blue-400" />,
            color: "border-blue-400/20 bg-blue-400/5"
          },
          {
            title: "Real-time Risk Monitoring",
            desc: "Visual dashboard for monitoring live PnL, drawdowns, and exposure across all deployed strategies simultaneously.",
            icon: <ArrowRight className="h-5 w-5 text-violet-400" />,
            color: "border-violet-400/20 bg-violet-400/5"
          },
          {
            title: "Smart Order Routing (SOR)",
            desc: "Automatically find the best execution prices and deepest liquidity across multiple exchanges in real-time.",
            icon: <Plus className="h-5 w-5 text-orange-400" />,
            color: "border-orange-400/20 bg-orange-400/5"
          }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className={`glass-edge p-6 flex flex-col gap-4 border ${feat.color} hover:bg-white/[0.04] transition-all group cursor-default`}
          >
             <div className="h-10 w-10 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all shadow-inner">
                {feat.icon}
             </div>
             <div>
                <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">{feat.title}</h3>
                <p className="text-[12px] text-white/40 leading-relaxed font-medium">{feat.desc}</p>
             </div>
          </motion.div>
        ))}
      </div>

      {/* CTA / Updates */}
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <button className="flex items-center gap-2 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all group">
             Notify me on Launch
             <ExternalLink className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
