"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -25]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-32 px-6 lg:px-12 bg-[#050505] overflow-hidden" style={{ perspective: "1500px" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div style={{ opacity }} className="text-center mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#55ff00]/60">
            Interface Mastery
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tighter text-white sm:text-6xl">
            Command the Markets
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-white/40">
            A terminal designed by quants, for quants. Zero-latency feedback, multi-timeframe analysis, and instant strategy deployment.
          </p>
        </motion.div>

        {/* Dashboard Mockup with 3D Rotate */}
        <motion.div
          style={{ rotateX, scale, opacity }}
          className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 group"
        >
          {/* Header Bar Mockup */}
          <div className="bg-white/5 border-b border-white/10 px-6 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-green-500/50" />
            </div>
            <div className="h-4 w-32 rounded bg-white/5" />
          </div>

          {/* Main Content Mockup */}
          <div className="bg-[#0a0a0a] p-8 aspect-[16/10] relative">
            <div className="grid grid-cols-4 gap-6 h-full">
              {/* Sidebar Mock */}
              <div className="col-span-1 border-r border-white/5 pr-6 flex flex-col gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 w-full rounded bg-white/5" />
                ))}
              </div>
              
              {/* Main Area Mock */}
              <div className="col-span-3 flex flex-col gap-6">
                <div className="h-2/3 w-full rounded-lg bg-white/5 overflow-hidden p-6 relative">
                   {/* Fake Chart Lines */}
                   <svg className="w-full h-full opacity-20" preserveAspectRatio="none">
                      <motion.path 
                        d="M0,100 L50,120 L100,80 L150,140 L200,60 L250,90 L300,40 L350,70 L400,20 L450,50 L500,10 L550,60 L600,0L650,40 L700,10 L750,50 L800,20"
                        stroke="#55ff00"
                        strokeWidth="3"
                        fill="none"
                        animate={{ pathLength: [0, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-[#55ff00] animate-ping" />
                   </div>
                </div>
                <div className="h-1/3 grid grid-cols-2 gap-6">
                   <div className="rounded-lg bg-white/5" />
                   <div className="rounded-lg bg-white/5" />
                </div>
              </div>
            </div>

            {/* Neon Glow Overlay */}
            <div className="absolute inset-0 bg-[#55ff00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Floating background blobs */}
      <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] bg-[#55ff00]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] bg-[#55ff00]/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
