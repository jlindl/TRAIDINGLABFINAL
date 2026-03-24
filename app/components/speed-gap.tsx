"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SpeedGap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Animation transforms
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);
  
  // Elements moving across the screen to simulate speed
  const xLeft = useTransform(scrollYProgress, [0.1, 0.9], ["-100%", "200%"]);
  const xRight = useTransform(scrollYProgress, [0.1, 0.9], ["200%", "-100%"]);
  
  // Text reveal
  const textY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <div id="workflow" ref={containerRef} className="relative h-[300vh] w-full bg-[#050505]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Background 'Speed Lines' */}
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#55ff00]/20 to-transparent"
              style={{
                width: Math.random() * 400 + 200,
                left: "-50%",
                top: `${(i / 20) * 100}%`,
                x: i % 2 === 0 ? xLeft : xRight,
              }}
            />
          ))}
        </motion.div>

        <motion.div 
          style={{ scale, opacity }}
          className="relative z-10 flex flex-col items-center text-center px-6"
        >
          <motion.span 
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#55ff00]/60"
          >
            The Execution Advantage
          </motion.span>
          
          <motion.h2 
            style={{ y: textY, opacity: textOpacity }}
            className="mt-6 text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl"
          >
            Sub-Millisecond <br /> Precision
          </motion.h2>
          
          <motion.p 
            style={{ opacity: textOpacity }}
            className="mt-8 max-w-2xl text-lg text-white/40 font-medium leading-relaxed"
          >
            In high-frequency trading, every microsecond is a battlefield. 
            Our co-located infrastructure delivers the data before the market even moves.
          </motion.p>
          
          {/* Latency Counter Mockup */}
          <div className="mt-12 flex items-baseline gap-2">
            <span className="text-6xl font-bold text-[#55ff00] tabular-nums">0.82</span>
            <span className="font-mono text-xl text-white/20">ms</span>
          </div>
        </motion.div>

        {/* Decorative Grid Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#050505_80%)]" />
      </div>
    </div>
  );
}
