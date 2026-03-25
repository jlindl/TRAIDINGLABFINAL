"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "Paper Trader",
    price: "£0",
    description: "Ideal for beginners and strategy refinement.",
    features: [
      "5 AI Research Sessions / Day",
      "3 Backtest Simulations / Day",
      "Standard Indicator Suite",
      "Community Access"
    ],
    button: "Start Free",
    popular: false,
  },
  {
    name: "Pro Trader",
    price: "£49",
    period: "/mo",
    description: "The gold standard for institutional-grade quant research.",
    features: [
      "40 AI Research Sessions / Day",
      "100 Backtest Simulations / Day",
      "Elite Indicators (SMC, TEMA, HMA)",
      "Institutional Sentiment Data",
      "Priority Strategy Persistence"
    ],
    button: "Go Pro",
    popular: true,
  },
  {
    name: "Quant Expert",
    price: "Custom",
    description: "Bespoke infrastructure for high-frequency funds.",
    features: [
      "Sub-ms Co-location",
      "Custom ML Models",
      "Dedicated Compute Node",
      "Whitelabel API Access"
    ],
    button: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 px-6 lg:px-12 bg-[#050505]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#55ff00]/60">
            Professional Grade
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tighter text-white sm:text-6xl">
            Choose Your Edge
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                plan.popular 
                  ? "border-[#55ff00] bg-[#55ff00]/5 shadow-[0_0_50px_rgba(85,255,0,0.1)]" 
                  : "border-white/10 bg-white/[0.02]"
              } backdrop-blur-xl`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#55ff00] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Top Margin Value
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-white/40">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-white/20 font-medium">{plan.period}</span>}
              </div>

              <ul className="mb-10 flex-1 flex flex-col gap-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-white/60">
                    <svg className="h-4 w-4 text-[#55ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                plan.popular
                  ? "bg-[#55ff00] text-black shadow-[0_0_20px_rgba(85,255,0,0.2)] hover:shadow-[0_0_40px_rgba(85,255,0,0.4)]"
                  : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
              }`}>
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background radial glow behind pricing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] bg-[#55ff00]/5 blur-[200px] pointer-events-none" />
    </section>
  );
}
