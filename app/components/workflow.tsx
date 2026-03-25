"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Ideate",
    label: "FROM INSPIRATION",
    description: "Speak your market intuition directly. Our Neural Engine translates human strategy into precise algorithmic technical logic instantly.",
    img: "/assets/landing/workflow-ideate.png",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75-3.75h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Validate",
    label: "TO VERIFICATION",
    description: "Put your ideas to the fire. Run institutional-grade backtests against years of historical tick data in seconds. No survivor bias, just facts.",
    img: "/assets/landing/workflow-validate.png", 
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12l3-3 4.5 4.5 4.5-4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Automate",
    label: "TO EXECUTION",
    description: "Deploy with total confidence. Convert your validated strategy into an executable contract ready for institutional routing and live trading.",
    img: "/assets/landing/workflow-automate.png",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

export default function Workflow() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section
      id="workflow"
      ref={containerRef}
      className="relative py-[var(--section-py)] mb-[10vh] px-6 lg:px-12 overflow-hidden"
    >
      {/* Background Neural Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(0,255,136,0.1)_0%,transparent_50%)]" />
         <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-32 text-center lg:text-left">
           <span className="font-mono text-xs uppercase tracking-[0.4em] text-neon/60">
             The Quanter Pathway
           </span>
           <h2 className="gradient-text mt-4 text-5xl font-black tracking-[-0.05em] sm:text-7xl lg:text-8xl">
             FROM IDEA TO ALPHA.
           </h2>
        </div>

        <div className="relative flex flex-col gap-[30vh]">
          
          {/* Traveling Vertical Pathway */}
          <div className="absolute left-[30px] lg:left-[calc(50%-1px)] top-0 h-full w-[2px] bg-white/5 overflow-hidden hidden sm:block">
             <motion.div 
               style={{ scaleY: smoothProgress, originY: 0 }}
               className="h-full w-full bg-neon shadow-[0_0_20px_rgba(0,255,136,0.5)]"
             />
          </div>

          {steps.map((step, i) => (
            <WorkflowStep 
              key={step.id} 
              step={step} 
              i={i} 
              progress={smoothProgress} 
              total={steps.length} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowStep({ step, i, progress, total }: { step: any, i: number, progress: any, total: number }) {
  const start = i / total;
  const end = (i + 1) / total;
  
  const opacity = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0.3, 1, 1, 0.3]);
  const scale = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0.95, 1, 1, 0.95]);
  const yTitle = useTransform(progress, [start, start + 0.1], [100, 0]);
  const opacityTitle = useTransform(progress, [start, start + 0.05], [0, 1]);
  const beadOpacity = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
  const beadScale = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0.5, 1.2, 1.2, 0.5]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-24 group"
    >
      {/* Visual Viewport */}
      <div className={`w-full lg:w-1/2 flex justify-center ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl transition-all duration-700 group-hover:border-neon/30">
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" 
            style={{ backgroundImage: `url(${step.img})` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
        </div>
      </div>

      {/* Step Content */}
      <div className={`w-full lg:w-1/2 flex flex-col text-center lg:text-left ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon border border-neon/20 shadow-[0_0_15px_rgba(0,255,136,0.1)] group-hover:shadow-[0_0_25px_rgba(0,255,136,0.3)] transition-all">
            {step.icon}
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#55ff00]">Step 0{step.id}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/30 mb-2">{step.label}</span>
        
        <div className="overflow-hidden">
          <motion.h3 
            style={{ y: yTitle, opacity: opacityTitle }}
            className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-6"
          >
            {step.title}
          </motion.h3>
        </div>

        <p className="text-lg text-white/40 leading-relaxed font-medium">
          {step.description}
        </p>
      </div>

      {/* Pathway Bead Holder */}
      <div className="absolute left-[30px] lg:left-[calc(50%-1px)] top-1/2 -translate-x-[calc(50%)] -translate-y-1/2 hidden sm:flex items-center justify-center">
        <motion.div 
          style={{ opacity: beadOpacity, scale: beadScale }}
          className="h-4 w-4 rounded-full bg-neon shadow-[0_0_20px_rgba(0,255,136,1)] z-10"
        />
      </div>
    </motion.div>
  );
}
