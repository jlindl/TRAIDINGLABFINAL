"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  CreditCard,
  MessageSquare,
  ExternalLink,
  LifeBuoy
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

/* ── FAQ Database ─────────────────────── */
const FAQS = [
  {
    category: "Core Mechanics",
    icon: <Zap className="h-4 w-4" />,
    questions: [
      {
        q: "Does TRADINGLAB support live trading?",
        a: "Currently, TRADINGLAB is in Phase 1: Research. Live broker deployment (Binance, ByBit, IBKR) is scheduled for Phase 4: Autonomous Dominance. For now, you can perform tick-accurate backtesting and strategy research."
      },
      {
        q: "Do I need to know how to code?",
        a: "No. The AI Strategy Lab translates your structured inputs and natural language descriptions into deterministic LabScript logic perfectly suited for algorithmic testing."
      },
      {
        q: "What assets are covered?",
        a: "We currently support 10-tick historical data for Binance (BTC/USDT, ETH/USDT), Major FX Pairs (EUR/USD, GBP/USD), and CME Indices (ES, NQ)."
      }
    ]
  },
  {
    category: "Billing & Quotas",
    icon: <CreditCard className="h-4 w-4" />,
    questions: [
      {
        q: "What is the AI Generation limit?",
        a: "AI strategy generation is subject to your tier's monthly cap. Pro Traders receive generous quotas, and you can monitor your real-time usage in the 'Quotas' section of the Dashboard."
      },
      {
        q: "How does the annual discount work?",
        a: "By switching to annual billing, you receive a 20% discount on Pro and Expert tiers. This is billed as a single upfront payment each year."
      }
    ]
  },
  {
    category: "Governance & Safety",
    icon: <ShieldCheck className="h-4 w-4" />,
    questions: [
      {
        q: "Are my strategies private?",
        a: "Yes. Every strategy generated in your Lab is encrypted and stored in your private Strategy Vault. We do not have access to your proprietary logic."
      },
      {
        q: "Can I export my strategies?",
        a: "Strategy export to raw LabScript code is an Enterprise/Expert feature scheduled for Phase 3: LabScript Core deployment."
      }
    ]
  }
];

function FAQAccordion({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left group transition-all"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-neon' : 'text-white/60 group-hover:text-white'}`}>
          {q}
        </span>
        <div className={`h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 transition-transform ${isOpen ? 'rotate-180 bg-neon/10 border-neon/30 text-neon' : 'text-white/40'}`}>
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-white/40 leading-relaxed max-w-2xl font-medium">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");

  return (
    <main className="relative z-10 bg-[#050505] min-h-screen text-white pt-32">
      
      {/* Background Decor */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-20" />
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Hero Header */}
      <header className="relative px-6 lg:px-12 text-center pb-24">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-edge inline-flex items-center gap-3 px-4 py-2 border-white/10 bg-white/5 text-white/60 mb-8"
        >
           <HelpCircle className="h-4 w-4" />
           <span className="font-mono text-[10px] uppercase tracking-widest font-black">Support Nexus</span>
        </motion.div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
          HOW CAN WE <br/>
          <span className="text-white/20">SUPPORT YOU?</span>
        </h1>

        <div className="mx-auto max-w-xl relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-neon transition-colors" />
           <input 
             type="text" 
             placeholder="Search the Intelligence Database..." 
             className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 text-sm focus:outline-none focus:border-neon focus:bg-white/[0.08] transition-all"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </header>

      {/* FAQ Grid */}
      <section className="relative px-6 lg:px-12 pb-48">
         <div className="mx-auto max-w-5xl space-y-24">
            
            {FAQS.map((category, idx) => (
              <div key={idx} className="space-y-4">
                 <div className="flex items-center gap-3 text-neon mb-8">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-neon/10 border border-neon/20 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
                       {category.icon}
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] font-mono">{category.category}</h2>
                 </div>

                 <div className="glass-edge p-8 lg:p-12 bg-white/[0.01] border-white/5">
                    {category.questions.map((faq, i) => (
                      <FAQAccordion key={i} q={faq.q} a={faq.a} />
                    ))}
                 </div>
              </div>
            ))}

            {/* Support CTA */}
            <div className="glass-edge p-12 bg-white/[0.01] border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden group">
               <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Still Need Intelligence?</h3>
                  <p className="text-white/40 max-w-md font-medium">Our Senior Quant Engineering team is available 24/7 in our secure Discord hub for complex troubleshooting.</p>
               </div>
               <Link 
                 href="/community" 
                 className="flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neon transition-all hover:shadow-[0_0_40px_rgba(0,255,136,0.4)]"
               >
                 <MessageSquare className="h-4 w-4" />
                 Enter Discord Hub
                 <ChevronRight className="h-4 w-4" />
               </Link>
            </div>

         </div>
      </section>

      {/* Footer Navigation */}
      <footer className="relative py-24 border-t border-white/5 text-center px-6">
         <div className="mx-auto max-w-xl space-y-6">
            <LifeBuoy className="h-8 w-8 text-white/10 mx-auto" />
            <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Protocol Resources</h4>
            <div className="flex flex-wrap items-center justify-center gap-6">
               <Link href="/terms-of-service" className="text-xs text-white/20 hover:text-white transition-colors">Term of Service</Link>
               <Link href="/privacy" className="text-xs text-white/20 hover:text-white transition-colors">Security Privacy</Link>
               <Link href="/roadmap" className="text-xs text-white/20 hover:text-white transition-colors italic">Development Roadmap</Link>
            </div>
         </div>
      </footer>

    </main>
  );
}
