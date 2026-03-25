"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  Zap, 
  ArrowRight,
  ChevronRight,
  Globe,
  DiscordIcon // Generic for now, using MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <main className="relative z-10 bg-[#050505] min-h-screen text-white pt-32">
      
      {/* Background Decor */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-20" />
      <div className="absolute top-0 right-0 w-full h-[80vh] bg-gradient-to-l from-neon/10 via-transparent to-transparent pointer-events-none" />

      {/* Hero Section */}
      <header className="relative px-6 lg:px-12 text-center pb-24">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-edge inline-flex items-center gap-3 px-4 py-2 border-neon/30 bg-neon/10 text-neon mb-8"
        >
           <Users className="h-4 w-4" />
           <span className="font-mono text-[10px] uppercase tracking-widest font-black">Community Protocol Hub</span>
        </motion.div>
        
        <h1 className="text-6xl lg:text-[8rem] font-black text-white uppercase tracking-tighter mb-8 leading-[0.8]">
          INTELLIGENCE <br/>
          <span className="text-white/20">COLLECTIVE.</span>
        </h1>

        <div className="mx-auto max-w-2xl">
           <p className="text-lg text-white/40 leading-relaxed font-medium mb-12">
             TRADINGLAB is fueled by a global brotherhood of quantitative researchers and automated traders. Join the Hub to access shared alpha and validated logic.
           </p>

           <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="https://discord.gg/tradinglab" // Generic link
                className="flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-neon transition-all hover:shadow-[0_0_50px_rgba(0,255,136,0.5)] group"
              >
                <MessageSquare className="h-5 w-5" />
                Join the Discord Hub
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </header>

      {/* Stats / Value Props */}
      <section className="relative px-6 lg:px-12 pb-48">
         <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-3">
            
            <div className="glass-edge p-10 bg-white/[0.01] border-white/5 group hover:border-white/10 transition-all">
               <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-neon/10 border border-neon/20 text-neon mb-8">
                  <MessageSquare className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">Elite Quant Intel</h3>
               <p className="text-sm text-white/40 leading-relaxed">Direct access to private channels where top-performing traders share validated LabScript logic and market insights.</p>
            </div>

            <div className="glass-edge p-10 bg-white/[0.01] border-white/5 group hover:border-white/10 transition-all lg:mt-12">
               <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-neon/10 border border-neon/20 text-neon mb-8">
                  <Trophy className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">Alpha Competitions</h3>
               <p className="text-sm text-white/40 leading-relaxed">Participate in monthly backtest showdowns. Top performers earn exclusive badges and TRAID Coin bonuses (Phase 5).</p>
            </div>

            <div className="glass-edge p-10 bg-white/[0.01] border-white/5 group hover:border-white/10 transition-all lg:mt-24">
               <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-neon/10 border border-neon/20 text-neon mb-8">
                  <Globe className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">Global Signal Flow</h3>
               <p className="text-sm text-white/40 leading-relaxed">A live network of multi-asset intelligence flowing from the lab to the community, 24 hours a day.</p>
            </div>

         </div>
      </section>

      {/* Live Activity (Simulated) */}
      <section className="relative py-24 border-t border-white/5 bg-white/[0.01]">
         <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-4 max-w-md">
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic">
                    Live Collective <br/>
                    <span className="text-white/20">Intelligence.</span>
                 </h2>
                 <p className="text-sm text-white/40 font-medium leading-relaxed">
                   Join 12,400+ members currently optimizing their edge across Global Markets.
                 </p>
               </div>

               <div className="flex gap-4">
                  <div className="glass-edge p-6 bg-black border-white/10 text-center min-w-[120px]">
                     <span className="block text-2xl font-black text-neon">2.4k+</span>
                     <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Online Now</span>
                  </div>
                  <div className="glass-edge p-6 bg-black border-white/10 text-center min-w-[120px]">
                     <span className="block text-2xl font-black text-white">480+</span>
                     <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Shared Vaults</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </main>
  );
}
