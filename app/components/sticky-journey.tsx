"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

const SHIFTS = [
  {
    id: "01",
    title: "Market Chaos",
    label: "PHASE 01: THE NOISE",
    content: "Most traders fail because they confuse market noise with edge. Overwhelmed by indicators and headlines, they lose precision. TradingLab provides the clarity you need to survive and thrive.",
    img: "/assets/landing/market-noise.png",
  },
  {
    id: "02",
    title: "AI Analysis",
    label: "PHASE 02: THE SIGNAL",
    content: "Our Neural Engine never sleeps. It audits 150+ global markets, identifying high-probability institutional setups using advanced SMC and technical logic. Pure data, no emotion.",
    img: "/assets/landing/ai-hologram.png",
  },
  {
    id: "03",
    title: "The Quanter",
    label: "PHASE 03: THE EDGE",
    content: "Transform intuition into automation. From strategy ideation to full-scale validation and execution in 15 seconds. Institutional power, now in your hands.",
    img: "/assets/landing/hero-bg-3d.png",
  }
];

export default function StickyJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative h-[600vh] bg-[#050505] overflow-visible">
      
      {/* Neural Grid Backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.03)_0%,transparent_70%)]" />
        <div 
          className="h-full w-full opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(var(--neon) 1px, transparent 1px)`, 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 h-screen grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           
           {/* LEFT COLUMN: Visuals */}
           <div className="relative order-2 lg:order-1 flex items-center justify-center h-[50vh] lg:h-full">
              <div className="relative w-full max-w-[500px] aspect-square group">
                <div className="absolute inset-0 rounded-[40px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl">
                   {SHIFTS.map((shift, i) => (
                     <BackgroundLayer 
                       key={shift.id} 
                       shift={shift} 
                       i={i} 
                       progress={smoothProgress} 
                       total={SHIFTS.length} 
                     />
                   ))}
                </div>

                <div className="absolute -top-6 -right-6 flex flex-col gap-3">
                   {SHIFTS.map((_s, i) => (
                     <SystemLabel 
                       key={i} 
                       i={i} 
                       progress={smoothProgress} 
                       total={SHIFTS.length} 
                       text={`SYSTEMS NOMINAL ${SHIFTS[i].id}`} 
                     />
                   ))}
                </div>
              </div>
           </div>

           {/* RIGHT COLUMN: Text */}
           <div className="relative order-1 lg:order-2 h-full flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
              {SHIFTS.map((shift, i) => (
                <JourneyContent 
                  key={shift.id + "_text"} 
                  shift={shift} 
                  i={i} 
                  progress={smoothProgress} 
                  total={SHIFTS.length} 
                />
              ))}
           </div>
        </div>

        {/* Global Progress Line Overlay */}
        <div className="absolute top-0 right-0 h-full w-[1px] bg-white/5 z-40">
           <motion.div 
             style={{ scaleY: smoothProgress, originY: 0 }}
             className="h-full w-full bg-neon shadow-[0_0_10px_rgba(0,255,136,0.5)]"
           />
        </div>

        {/* Vertical Timeline Sidebar */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12 items-center z-40">
           {SHIFTS.map((_s, i) => (
              <IndicatorDot 
                key={i} 
                i={i} 
                progress={smoothProgress} 
                total={SHIFTS.length} 
                label={SHIFTS[i].label}
              />
           ))}
        </div>
      </div>
    </div>
  );
}

function BackgroundLayer({ shift, i, progress, total }: { shift: any, i: number, progress: MotionValue<number>, total: number }) {
  const start = i / total;
  const end = (i + 1) / total;
  const buffer = 0.15 / total;

  const opacity = useTransform(progress, [Math.max(0, start - buffer), start, end - buffer, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start - buffer, start, end - buffer, end], [20, 0, 0, -20]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 p-8"
    >
      <div 
        className="h-full w-full rounded-2xl bg-cover bg-center grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0"
        style={{ backgroundImage: `url(${shift.img})` }} 
      />
      <div className="absolute inset-8 rounded-2xl bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
    </motion.div>
  );
}

function SystemLabel({ i, progress, total, text }: { i: number, progress: MotionValue<number>, total: number, text: string }) {
  const start = i / total;
  const end = (i + 1) / total;
  const opacity = useTransform(progress, [start, start + 0.1 / total, end - 0.1 / total, end], [0, 1, 1, 0]);
  
  return (
    <motion.div 
      style={{ opacity }}
      className="bg-neon px-3 py-1 text-black font-mono text-[8px] font-black uppercase tracking-widest whitespace-nowrap"
    >
      {text}
    </motion.div>
  );
}

function JourneyContent({ shift, i, progress, total }: { shift: any, i: number, progress: MotionValue<number>, total: number }) {
  const start = i / total;
  const end = (i + 1) / total;
  const buffer = 0.1 / total;

  const opacity = useTransform(progress, [start, start + buffer, end - buffer, end], [0, 1, 1, 0]);
  const x = useTransform(progress, [start, start + buffer, end - buffer, end], [40, 0, 0, -40]);

  return (
    <motion.div
      key={shift.id + "_text"}
      style={{ opacity, x, pointerEvents: 'none' }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <span className="font-mono text-xs uppercase tracking-[0.5em] text-neon/60 mb-6 font-bold">
        {shift.label}
      </span>
      <h3 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8 uppercase">
        {shift.title}
      </h3>
      <p className="max-w-md text-base sm:text-lg lg:text-xl font-medium text-white/30 leading-relaxed">
        {shift.content}
      </p>
      
      <div className="mt-12 flex items-center gap-4 opacity-40">
         <div className="h-px w-12 bg-white/20" />
         <span className="font-mono text-[10px] tracking-widest uppercase">Analyze Market</span>
      </div>
    </motion.div>
  );
}

function IndicatorDot({ i, progress, total, label }: { i: number, progress: MotionValue<number>, total: number, label: string }) {
  const start = i / total;
  const end = (i + 1) / total;
  const active = useTransform(progress, [start, end], [0.1, 1]);
  const height = useTransform(active, [0, 1], [0, 24]);

  return (
    <div className="group relative flex flex-col items-center">
       <motion.div 
         style={{ height, opacity: active }}
         className="absolute -top-12 w-[1px] bg-neon"
       />
       <div className="h-2 w-2 rounded-full border border-white/20 group-hover:border-neon transition-colors" />
       <span className="absolute left-6 font-mono text-[8px] opacity-0 group-hover:opacity-40 transition-opacity whitespace-nowrap">
         {label}
       </span>
    </div>
  );
}
