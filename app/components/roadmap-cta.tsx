"use client";

import { motion } from "framer-motion";
import { Map, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function RoadmapCTA() {
  return (
    <section className="relative py-24 px-6 lg:px-12 overflow-hidden border-y border-white/5 bg-white/[0.01]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[200px] bg-neon/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="glass-edge inline-flex items-center gap-3 px-4 py-2 border-neon/20 bg-neon/10 text-neon mb-8"
        >
           <Sparkles className="h-4 w-4" />
           <span className="font-mono text-[10px] uppercase tracking-widest font-black">Strategic Future</span>
        </motion.div>
        
        <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 italic">
          BEYOND RESEARCH. <br/>
          <span className="text-white/20">TOWARDS INFRASTRUCTURE.</span>
        </h2>
        
        <p className="mx-auto max-w-2xl text-lg text-white/40 leading-relaxed font-medium mb-12">
          TRADINGLAB is evolving from a testing suite into a full institutional trading ecosystem. Explore the Lab Blueprint to see what's coming next.
        </p>

        <Link 
          href="/roadmap"
          className="group relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 font-black uppercase tracking-widest text-sm hover:bg-neon transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]"
        >
          View Full Roadmap
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </section>
  );
}
