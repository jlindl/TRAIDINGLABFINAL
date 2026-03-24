"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
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
          We've sent a password reset link to <strong>{email}</strong>.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-neon px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-neon-dim"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-edge shimmer p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
      <p className="text-sm text-white/40 mb-8">
        Enter your email to receive a recovery link.
      </p>

      <form onSubmit={handleReset} className="space-y-4">
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

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-neon py-3.5 text-sm font-semibold text-black transition-all hover:bg-neon-dim disabled:opacity-50"
        >
          {loading ? "Sending link..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-white/30">
        Remembered your password?{" "}
        <Link href="/login" className="text-white hover:text-neon transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
}
