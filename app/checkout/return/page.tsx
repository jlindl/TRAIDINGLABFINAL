"use client";

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function ReturnPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white">
        <Loader2 className="h-12 w-12 animate-spin text-neon" />
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-white/40">Verifying session...</p>
      </div>
    );
  }

  if (status === 'open') {
    return redirect('/checkout');
  }

  if (status === 'complete') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white p-6">
        <div className="max-w-md w-full glass-edge p-12 text-center bg-white/[0.02] border-[#55ff00]/20 shadow-[0_0_50px_rgba(85,255,0,0.05)]">
          <div className="h-20 w-20 rounded-full bg-[#55ff00]/10 border border-[#55ff00]/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10 text-[#55ff00]" />
          </div>
          
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Activation Successful</h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            Your Pro Trader subscription is now active for <span className="text-white font-bold">{customerEmail}</span>. 
            The TradingLab Neural Engine is fully unlocked.
          </p>

          <Link 
            href="/dashboard"
            className="group flex items-center justify-center gap-2 w-full py-4 bg-[#55ff00] text-black font-bold uppercase tracking-widest hover:bg-[#44cc00] transition-all"
          >
            Enter Dashboard
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white p-6">
      <div className="max-w-md w-full glass-edge p-12 text-center bg-white/[0.02] border-red-500/20 shadow-[0_0_50px_rgba(255,59,59,0.05)]">
        <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-8">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Payment Incomplete</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Something went wrong with your transaction. Please contact support if you believe this is an error.
        </p>

        <Link 
          href="/dashboard"
          className="flex items-center justify-center w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
