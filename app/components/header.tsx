"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Pricing", href: "/pricing" },
  { label: "Community", href: "/community" },
  { label: "Help", href: "/help" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          // Fetch plan from profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("plan")
            .eq("id", authUser.id)
            .single();
          
          setUser({ ...authUser, plan: profile?.plan || "Free" });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Header fetchUser error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Safety timeout: don't let a hanging auth check block the UI for more than 3 seconds
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch plan again if auth state changes (e.g. login)
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", session.user.id)
          .single();
        
        setUser({ ...session.user, plan: profile?.plan || "Free" });
      } else {
        setUser(null);
      }
      
      if (event === "SIGNED_OUT") {
        router.push("/");
        router.refresh();
      }
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring" as const, stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo — Refined Size */}
        <Link href="/" className="relative flex items-center w-[180px] h-full">
          <img 
            src="/Logo.png" 
            alt="TraidingLab Logo" 
            className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 origin-left z-20" 
            style={{ minWidth: '180px' }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-0.5">
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-white transition-colors hover:text-neon"
                    >
                      Dashboard
                    </Link>
                    <span className={`text-[10px] font-mono px-1.5 rounded bg-white/5 border border-white/10 ${
                      user.plan === 'Quant Expert' ? 'text-violet-400 border-violet-500/20' : 
                      user.plan === 'TraderPro' ? 'text-neon border-neon/20' : 
                      user.plan === 'Papertrader' ? 'text-blue-400 border-blue-500/20' : 'text-white/30'
                    }`}>
                      {user.plan?.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-[#55ff00] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#44cc00] hover:shadow-[0_0_25px_rgba(85,255,0,0.3)]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-white/5" />
              {user ? (
                <>
                   <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:text-white"
                  >
                    <span>Dashboard</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neon">
                      {user.plan?.toUpperCase()}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }}
                    className="mt-1 rounded-lg bg-white/5 border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 rounded-lg bg-[#55ff00] px-5 py-3 text-center text-sm font-semibold text-black"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
