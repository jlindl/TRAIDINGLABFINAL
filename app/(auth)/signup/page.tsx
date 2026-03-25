"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms & Conditions to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    }).catch(err => {
      console.error("Supabase signUp caught error:", err);
      return { data: { user: null, session: null }, error: err };
    });

    if (signupError) {
      console.error("Signup error details:", signupError);
      setError(signupError.message || "Connection failed. Please check your network or restart the dev server.");
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-edge shimmer p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neon/10 border border-neon/20">
          <svg className="h-8 w-8 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
        <p className="text-sm text-white/40 mb-8">
          We've sent a verification link to <strong>{email}</strong>.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-neon px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-neon-dim"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-edge shimmer p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
      <p className="text-sm text-white/40 mb-8">
        Join the next generation of algorithmic traders.
      </p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/30 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/30 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-white/30 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3 px-1 py-2">
           <input 
             id="terms"
             type="checkbox"
             checked={agreedToTerms}
             onChange={(e) => setAgreedToTerms(e.target.checked)}
             className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-neon focus:ring-neon accent-neon cursor-pointer"
           />
           <label htmlFor="terms" className="text-[11px] leading-relaxed text-white/40 transition-colors">
             I acknowledge that I have read and agree to the <Link href="/terms-of-service" className="text-white hover:text-neon underline">Terms & Conditions</Link>, including the mandatory risk disclosures.
           </label>
        </div>

        <button
          type="submit"
          disabled={loading || !agreedToTerms}
          className="w-full rounded-lg bg-neon py-3.5 text-sm font-semibold text-black transition-all hover:bg-neon-dim hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-white/30">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:text-neon transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
}
