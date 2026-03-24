export default function PrivacyPage() {
  return (
    <main className="relative z-10 bg-[#050505] min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#55ff00]/60">
          Data Security
        </span>
        <h1 className="mt-6 text-4xl font-black tracking-tighter text-white sm:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-white/40 font-mono uppercase tracking-widest">
          Last Updated: March 24, 2026
        </p>

        <div className="mt-16 space-y-12 text-white/60 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Data Collection</h2>
            <p>
              We collect minimal data necessary for core platform functionality, including authentication details, encrypted API keys, and strategy parameters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Security Standards</h2>
            <p>
              All sensitive credentials (API keys, secret phrases) are encrypted using AES-256-GCM and stored in a secure vault isolated from the public network.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Third-Party Services</h2>
            <p>
              We integrate with high-fidelity market data providers (Alpha Vantage) and brokers. No strategy logic is ever shared with these third parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Your Rights</h2>
            <p>
              Under GDPR and CCPA, you have the right to access, export, or delete your data at any time from your account settings.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
