"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) return null;
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#050505] py-24 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <img 
                src="/Logo.png" 
                alt="TraidingLab Logo" 
                className="h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105 origin-left" 
              />
            </Link>
            <p className="max-w-xs text-sm text-white/30 leading-relaxed font-medium">
              Institutional-grade algorithmic trading platform. Powered by AI-optimized strategies and sub-millisecond execution.
            </p>
            <div className="flex items-center gap-4">
              {/* Social Media Links */}
              {[
                { 
                  name: "Twitter", 
                  icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )
                },
                { 
                  name: "Discord", 
                  icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                    </svg>
                  )
                },
                { 
                  name: "LinkedIn", 
                  icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )
                },
                { 
                  name: "GitHub", 
                  icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  )
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] transition-all hover:border-[#55ff00]/20 hover:bg-[#55ff00]/5"
                  aria-label={social.name}
                >
                  <div className="text-white/40 group-hover:text-[#55ff00] transition-colors">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#55ff00]">Product</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="/features" className="text-sm text-white/40 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/#market-data" className="text-sm text-white/40 hover:text-white transition-colors">Strategies</Link></li>
                <li><Link href="/dashboard" className="text-sm text-white/40 hover:text-white transition-colors">Lab Assistant</Link></li>
                <li><Link href="/#market-data" className="text-sm text-white/40 hover:text-white transition-colors">Market Data</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#55ff00]">Resources</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/help" className="text-sm text-white/40 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#55ff00]">Legal</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="/terms-of-service" className="text-sm text-white/40 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/risk-disclosure" className="text-sm text-white/40 hover:text-white transition-colors">Risk Disclosure</Link></li>
                <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Licensing</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-8 sm:flex-row">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 hover:text-[#55ff00] transition-colors">
              © {new Date().getFullYear()} TraidingLab — Universal Quantitative Infrastructure.
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/10">
              Co-located in LD4 / NY4 / TY3
            </span>
          </div>
          <div className="flex gap-4">
             {["Singapore", "London", "New York"].map((loc) => (
               <span key={loc} className="font-mono text-[10px] uppercase tracking-widest text-white/10">
                 {loc}
               </span>
             ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
