export default function RiskDisclosurePage() {
  return (
    <main className="relative z-10 bg-[#050505] min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#55ff00]/60">
          Professional Advisory
        </span>
        <h1 className="mt-6 text-4xl font-black tracking-tighter text-white sm:text-6xl">
          Risk Disclosure
        </h1>
        <p className="mt-4 text-sm text-white/40 font-mono uppercase tracking-widest">
          Critical Trading Information
        </p>

        <div className="mt-16 space-y-12 text-white/60 leading-relaxed">
          <section className="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              High Risk Warning
            </h2>
            <p className="text-white/80">
              Algorithmic trading involves substantial risk of loss and is not suitable for every investor. The valuation of financial instruments may fluctuate, and as a result, clients may lose more than their original investment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">No Advice</h2>
            <p>
              The platform and its AI components (Lab Assistant) provide technical tools and data analysis. We do not provide financial, investment, legal, or tax advice. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Technical Risk</h2>
            <p>
              System response and access times may vary due to market conditions, system performance, and other factors. Trading through an electronic platform carries risks such as hardware and software failure.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
