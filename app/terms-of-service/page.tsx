"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Scale, Gavel, FileText, Zap } from "lucide-react";
import Link from "next/link";

const TERMS_SECTIONS = [
  {
    title: "1. INTRODUCTION",
    content: "These Terms & Conditions (“Terms”) govern access to and use of the TRAIDINGLAB platform (“Platform”, “Service”). By accessing or using the Platform, you agree to be legally bound by these Terms. If you do not agree, you must not use the Platform."
  },
  {
    title: "2. NATURE OF THE SERVICE (CRITICAL SECTION)",
    content: "TRAIDINGLAB provides: Strategy creation tools, Backtesting and analytical tools, Data visualisation and simulation tools. TRAIDINGLAB does NOT: Provide financial advice, Provide investment recommendations, Act as a broker, intermediary, or portfolio manager, Execute trades on behalf of users (unless explicitly stated in future services). All outputs are: Simulated, hypothetical, and for informational purposes only.",
    highlight: true
  },
  {
    title: "3. NO FINANCIAL ADVICE",
    content: "Nothing on this Platform constitutes: Financial advice, Investment advice, Trading advice, Personal recommendations. Users acknowledge that: All decisions are made independently and at their own risk, TRAIDINGLAB does not consider individual financial circumstances."
  },
  {
    title: "4. RISK DISCLOSURE",
    content: "Trading financial markets involves substantial risk, including: Loss of capital, Volatility, Liquidity risks, Model failure. Users acknowledge: Past performance (simulated or real) is not indicative of future results, Backtesting results are hypothetical and may not reflect real market conditions, Strategies may fail in live environments."
  },
  {
    title: "5. BACKTESTING & SIMULATION LIMITATIONS",
    content: "All backtests: Are based on historical data, May contain assumptions, simplifications, and data limitations. Do not account for: Slippage, Execution delays, Liquidity constraints, Market impact. TRAIDINGLAB makes no guarantees regarding: Accuracy, Completeness, Real-world performance."
  },
  {
    title: "6. USER RESPONSIBILITY",
    content: "Users are solely responsible for: All trading decisions, Any use of strategies generated via the Platform, Any financial losses incurred. You agree: You will not rely solely on the Platform for financial decisions.",
    highlight: true
  },
  {
    title: "7. LIVE DEPLOYMENT DISCLAIMER (FUTURE-PROOF)",
    content: "Where live deployment features are used: TRAIDINGLAB acts only as a technology provider. Users retain full control and responsibility over execution. TRAIDINGLAB is not responsible for: Trade execution errors, Broker failures, API issues, Connectivity problems."
  },
  {
    title: "8. AI / AUTOMATION DISCLAIMER",
    content: "The Platform may use AI or automated systems to: Generate strategies, Interpret inputs, Suggest logic structures. Users acknowledge: AI outputs may be incorrect, incomplete, or misleading. AI-generated strategies are not guaranteed to be profitable or valid."
  },
  {
    title: "9. LIMITATION OF LIABILITY (VERY IMPORTANT)",
    content: "To the fullest extent permitted by law: TRAIDINGLAB shall not be liable for: Any financial loss, Loss of profits, Loss of data, Indirect or consequential damages. This includes losses arising from: Use of the Platform, Reliance on outputs, Strategy performance, Technical failures. Total liability (if any) is limited to: The amount paid by the user in the last 30 days.",
    highlight: true
  },
  {
    title: "10. INDEMNIFICATION",
    content: "Users agree to indemnify and hold harmless TRAIDINGLAB from any claims arising from: Their use of the Platform, Their trading activity, Any third-party disputes."
  },
  {
    title: "11. MARKET DATA DISCLAIMER",
    content: "Market data provided may be: Delayed, Incomplete, Inaccurate. TRAIDINGLAB does not guarantee: Data accuracy, Data availability. Users must independently verify data where required."
  },
  {
    title: "12. PLATFORM AVAILABILITY",
    content: "We do not guarantee: Continuous uptime, Error-free operation. The Platform may: Experience downtime, Be modified or discontinued at any time."
  },
  {
    title: "13. ACCOUNT & ACCESS",
    content: "You are responsible for: Maintaining account security, All activity under your account. We reserve the right to: Suspend or terminate accounts, Restrict access at our discretion."
  },
  {
    title: "14. INTELLECTUAL PROPERTY",
    content: "All Platform technology including: LabScript, Strategy engine, UI/UX, Algorithms are the property of TRAIDINGLAB. Users may not: Reverse engineer, Copy, Resell platform technology."
  },
  {
    title: "15. STRATEGY MARKETPLACE (FUTURE)",
    content: "Where applicable: TRAIDINGLAB acts as a marketplace facilitator only. We do not guarantee: Strategy performance, Seller credibility. Users purchase strategies at their own risk."
  },
  {
    title: "16. TRAID COIN DISCLAIMER (CRITICAL)",
    content: "If TRAID Coin is introduced: It is a utility token, not a security or investment product. It does not represent: Ownership, Equity, Profit rights. Value is not guaranteed."
  },
  {
    title: "17. REGULATORY POSITIONING (UK FOCUS)",
    content: "TRAIDINGLAB is not authorised or regulated by the FCA (unless this changes). Does not provide regulated financial services. Users are responsible for: Ensuring compliance with their local laws.",
    highlight: true
  },
  {
    title: "18. TERMINATION",
    content: "We may suspend or terminate access: For breach of Terms, For misuse of the Platform, At our discretion."
  },
  {
    title: "19. GOVERNING LAW",
    content: "These Terms are governed by: Laws of England and Wales."
  },
  {
    title: "20. FINAL DISCLAIMER (STRONG CLOSE)",
    content: "The Platform is provided: “AS IS” and “AS AVAILABLE”. No warranties are given regarding: Performance, Profitability, Suitability.",
    highlight: true
  }
];

export default function TermsPage() {
  return (
    <main className="relative z-10 bg-[#050505] min-h-screen pt-32 pb-48 px-6 lg:px-12">
      
      {/* Background Decor */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-20" />
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-red-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-24 text-center lg:text-left">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass-edge inline-flex items-center gap-3 px-4 py-2 border-white/10 bg-white/5 text-white/40 mb-8"
           >
              <Scale className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest font-black text-neon">Legal Protocol v2.5</span>
           </motion.div>
           
           <h1 className="text-5xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
             TERMS AND <br/>
             <span className="text-white/20">CONDITIONS.</span>
           </h1>
           
           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5 text-white/40">
              <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest">
                 <Gavel className="h-4 w-4 text-neon" />
                 Last Modified: March 24, 2026
              </div>
              <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest">
                 <FileText className="h-4 w-4" />
                 Jurisdiction: England & Wales
              </div>
           </div>
        </header>

        {/* Content */}
        <div className="space-y-12">
           {TERMS_SECTIONS.map((section, idx) => (
             <motion.section 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className={`glass-edge p-8 lg:p-12 transition-all group ${
                 section.highlight 
                   ? "bg-red-500/[0.03] border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.05)]" 
                   : "bg-white/[0.01] border-white/5 hover:border-white/10"
               }`}
             >
                <div className="flex items-center gap-4 mb-6">
                   <h2 className={`text-sm lg:text-base font-black uppercase tracking-widest ${
                     section.highlight ? "text-red-400" : "text-white"
                   }`}>
                     {section.title}
                   </h2>
                   {section.highlight && (
                     <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-[8px] font-black text-red-500 uppercase tracking-widest">
                        <ShieldAlert className="h-2.5 w-2.5" />
                        Critical Disclosure
                     </div>
                   )}
                </div>
                
                <div className={`text-sm lg:text-base leading-relaxed font-medium ${
                  section.highlight ? "text-white/80 italic font-bold" : "text-white/40"
                }`}>
                   {section.content.split(', ').map((sentence, i) => (
                     <p key={i} className="mb-4 last:mb-0">
                       {sentence.startsWith('👉') ? (
                         <span className="flex items-center gap-3 text-neon py-2 px-4 rounded bg-neon/10 border border-neon/20 my-4 inline-block font-black uppercase tracking-widest text-[10px]">
                           <Zap className="h-3.5 w-3.5" />
                           {sentence}
                         </span>
                       ) : sentence}
                     </p>
                   ))}
                </div>
             </motion.section>
           ))}
        </div>

        {/* Final Acceptance CTA */}
        <section className="mt-24 p-12 lg:p-24 bg-white/[0.03] border border-white/10 text-center rounded-3xl relative overflow-hidden group">
           <div className="relative z-10 space-y-8">
              <h2 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter italic">
                 Agreement to <br/>
                 <span className="text-white/20">Institutional Standards.</span>
              </h2>
              <p className="max-w-xl mx-auto text-white/40 leading-relaxed font-medium">
                By continuing to use our services, you definitively acknowledge having read, understood, and agreed to these strategic protocols.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 font-black uppercase tracking-widest text-sm hover:bg-neon transition-all hover:shadow-[0_0_50px_rgba(0,255,136,0.5)]"
              >
                Accept & Join the Lab
              </Link>
           </div>
        </section>

      </div>
    </main>
  );
}
