"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="glass-edge shimmer p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
      <p className="text-sm text-white/40 mb-8">
        Access your trading laboratory and strategies.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono uppercase tracking-widest text-white/30">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-neon hover:text-neon-dim transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-neon py-3.5 text-sm font-semibold text-black transition-all hover:bg-neon-dim hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-white/30">
        Don't have an account?{" "}
        <Link href="/signup" className="text-white hover:text-neon transition-colors">
          Create one
        </Link>
      </div>
    </div>
  );
}
