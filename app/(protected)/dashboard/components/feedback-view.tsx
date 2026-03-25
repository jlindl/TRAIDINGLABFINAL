"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Heart,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FeedbackCategory = "bug" | "feature" | "praise" | "other";

export default function FeedbackView({ user }: { user: any }) {
  const [category, setCategory] = useState<FeedbackCategory>("feature");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from("feedback")
        .insert({
          user_id: user.id,
          category,
          message: message.trim()
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      setMessage("");
    } catch (err: any) {
      console.error("Feedback submission failed:", err);
      setError(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[60vh] text-center"
      >
        <div className="h-20 w-20 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-neon" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Transmission Received</h2>
        <p className="text-white/40 text-sm max-w-md leading-relaxed">
          Your insights have been synchronized with the core development engine.
          We prioritize feedback based on network impact.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-10 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter uppercase italic">
          <MessageSquare className="h-8 w-8 text-neon" />
          Feedback Hub
        </h2>
        <p className="text-sm text-white/40 mt-1 uppercase tracking-widest font-mono text-[10px]">Direct line to the quant-lab engineers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Category Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["bug", "feature", "praise", "other"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${category === cat
                  ? "bg-neon/10 border-neon/40 shadow-[0_0_20px_rgba(0,255,136,0.05)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
            >
              {cat === "bug" && <Bug className={`h-5 w-5 ${category === "bug" ? "text-neon" : "text-white/20"}`} />}
              {cat === "feature" && <Lightbulb className={`h-5 w-5 ${category === "feature" ? "text-neon" : "text-white/20"}`} />}
              {cat === "praise" && <Heart className={`h-5 w-5 ${category === "praise" ? "text-neon" : "text-white/20"}`} />}
              {cat === "other" && <MessageSquare className={`h-5 w-5 ${category === "other" ? "text-neon" : "text-white/20"}`} />}
              <span className={`text-[10px] font-black uppercase tracking-widest ${category === cat ? "text-neon" : "text-white/20"
                }`}>
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* Message Area */}
        <div className="relative group">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              category === "bug" ? "Describe the anomaly..." :
                category === "feature" ? "What's missing from your workflow?" :
                  "Your transmission here..."
            }
            className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-white focus:border-neon focus:outline-none transition-all custom-scrollbar resize-none placeholder:text-white/10"
            required
          />
          <div className="absolute inset-0 rounded-2xl border border-neon/0 group-focus-within:border-neon/10 pointer-events-none transition-all" />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full py-5 rounded-2xl bg-neon text-black font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(0,255,136,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 disabled:hover:scale-100"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin border-2 border-black border-t-transparent rounded-full" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}
