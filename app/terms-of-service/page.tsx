export default function TermsPage() {
  return (
    <main className="relative z-10 bg-[#050505] min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#55ff00]/60">
          Legal Infrastructure
        </span>
        <h1 className="mt-6 text-4xl font-black tracking-tighter text-white sm:text-6xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-white/40 font-mono uppercase tracking-widest">
          Last Updated: March 24, 2026
        </p>

        <div className="mt-16 space-y-12 text-white/60 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using TraidingLab, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>
              TraidingLab provides an institutional-grade algorithmic trading platform, including strategy backtesting, execution infrastructure, and AI-driven market intelligence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Risk Disclosure</h2>
            <p className="text-[#55ff00]/80">
              Trading financial instruments involves significant risk. Past performance is not indicative of future results. You are solely responsible for your trading decisions and any resulting financial loss.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Intellectual Property</h2>
            <p>
              All strategies, algorithms, and technical infrastructure developed by TraidingLab are protected by international copyright and intellectual property laws.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
