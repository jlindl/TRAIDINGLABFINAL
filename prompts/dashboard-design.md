# TRAIDINGLAB Dashboard Design — The Master Prompt

> **Prompt Engineer Persona**: World-Class Next.js 16 & Gemini Specialist
> **Context**: Building an institutional-grade algorithmic trading dashboard within a high-performance React ecosystem.

---

## 🛠 The Prompt

**Objective**: Act as a Senior Full-Stack Engineer and Lead UI Designer. Build a premium, high-fidelity **Dashboard** for TRAIDINGLAB using Next.js 16 (App Router), Tailwind CSS 4, Framer Motion, and Supabase. The aesthetic must be **"Hyper-Glass & Depth"**—utilizing a deep black background (`#050505`), neon green accents (`#00ff88`), and red sub-colors (`#ff3b3b`) for negative metrics.

### 🎨 Visual Language & Design System
1. **Background**: Pure deep black with a subtle, non-intrusive geometric grid overlay (opacity 0.05).
2. **Components**: Use "Glass Cards"—surfaces with `backdrop-blur-xl`, `bg-white/[0.02]`, and a 1px solid border (`border-white/5`).
3. **Animations**: 
    - Smooth staggered entrances for all cards.
    - Magnetic hover effects on CTAs.
    - Pulsing neon green dots for "Active" states.
4. **Typography**: High contrast, monospaced fonts for data/numbers, bold sans-serif for headers.

### 🏗 Layout Structure
- **Global Sidebar**: Sticky left-aligned navigation with micro-animations. Glass-edge border on the right. Collapsible on mobile.
- **Top Bar**: User profile, notifications, and "Live Environment" status toggle.
- **Main View**: A scrollable area that renders the selected module.

### 🧩 Required Modules

#### 1. **Your Bots Section** (Performance-First)
- Card-based view of active algos.
- Show: Bot Name, Asset Pair (e.g., BTC/USDT), 24h PnL (percentage + mini-sparkline), and a Neon Green "Online" toggle.
- Use Framer Motion for pulsing status indicators.

#### 2. **Marketplace** (Bento Grid)
- Premium cards for community-developed strategies.
- Include: Star rating, "Profit Factor", "Sharpe Ratio", and a "Deploy to Lab" button.
- Floating glass effect on hover.

#### 3. **Ghost Writer** (AI-IDE Interface)
- A specialized coding area with a synthetic neon glow.
- Left pane: AI-Chat for "Write me a Mean Reversion strategy for ETH".
- Right pane: Code editor view (Syntax highlighted for Python/TS) with "Generate" and "Diff View" buttons.

#### 4. **Lab Assistant** (Research Hub)
- Complex data visualization.
- Monte Carlo simulation graphs (SVG/Canvas).
- Correlation matrices and strategy robustness scores.
- Use glass-morphism overlays for metric tooltips.

#### 5. **Developer Portal** (Infrastructure Control)
- API Key management with "Copy" and "Rotate" buttons.
- Webhook log viewer with "Live Stream" mode.
- Documentation snippets in a monospaced code-block look.

#### 6. **Backtesting Engine** (Analytical Engine)
- Large-scale candlestick chart component (simulated visual).
- Result overlay showing: Total Return, Max Drawdown, Win Rate.
- "Slider" to scrub through historical trade history with synchronized chart markers.

#### 7. **Deployment** (Environment Manager)
- Grid of server statuses across global regions (NY, London, Tokyo).
- Latency badges (text-neon).
- "Kill Switch" button (Red-bordered glass card) for emergency stop.

#### 8. **Help & Support**
- Quick-search command palette.
- Documentation links with hover-shimmer effects.

---

### 💻 Technical Implementation Constraints
- **State Management**: Use React `useState` and `useEffect` with Supabase `onAuthStateChange` for real-time profile syncing.
- **Responsiveness**: Grid layouts must be `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- **Performance**: High use of `memo` and optimized Framer Motion properties to ensure 60fps animations.
- **Safety**: Ensure RLS checks (user can only see their own bots).

---

**Output Style**: Return clean, production-ready TSX files. Separate logic into modular components within `@/app/components/dashboard`. Ensure every pixel feels premium and institutional.
