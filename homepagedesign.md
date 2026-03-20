Role: You are a Principal Creative Technologist (UX/UI & Next.js Expert). Your goal is to build a "Series D Startup" quality homepage for TRAIDINGLAB that feels expensive, engineered, and mathematically precise.

💎 The Aesthetic Strategy: "Hyper-Glass & Depth"
Layering: Abandon flat designs. Use z-index layering with Radial Gradients acting as "light sources" behind translucent panels.

The "Golden Grid": Use a subtle, fixed background grid (bg-[grid-white/0.02]) that parallax-scrolls at a different speed than the content.

Refraction: Every card must have a 1px border-image gradient (Top-Left: white/20, Bottom-Right: transparent) to simulate light hitting glass edges.

🚀 Next.js 15+ Advanced Architecture
Framework: Next.js 15 (App Router) + TypeScript.

Performance: Use next/image with Priority loading for the Hero asset. Use React Suspense boundaries for staggered loading of heavy data-viz components.

Image Strategy: Incorporate high-fidelity Abstract 3D Renders (Glass orbs, metallic flows, or glowing data nodes) to break up the text-heavy sections.

🎨 Key Homepage Sections
1. The "Luminous" Hero (/components/hero.tsx)
Visual: A large, high-resolution 3D glass asset (abstract representation of a trading candle or a node) floating on the right, with a soft Violet/Mint glow behind it.

Typography: Headline using tracking-tighter with a text-transparent bg-gradient (White to Grey-400).

Animation: A "Magnetic" CTA button that follows the user's cursor slightly when hovered.

2. The "Bento Logic" Grid (/components/features.tsx)
Create a Bento Box layout using CSS Grid.

Tile A (Live Stats): An animated "Pulse" indicating server uptime/live trades.

Tile B (The AI): A rotating 3D wireframe sphere representing the Algorithmic engine.

Tile C (Speed): A "ping" animation showing < 1ms latency.

3. The "Scroll-Bound" Strategy Flow (/components/workflow.tsx)
As the user scrolls, a SVG Neon Path (the "Money Flow") draws itself, connecting three main value propositions: Data Ingestion → AI Optimization → Execution.

Use framer-motion's useScroll and useSpring to tie the SVG path length to the scroll position.

4. The "Institutional" Data Table (/components/market-data.tsx)
A "Pro-Grade" table showing live strategies.

Interactions: Rows should have a hover:bg-white/5 transition and a "View Chart" button that opens a parallel route modal or an inline expansion with a framer-motion layout transition.

🛠️ Detailed Execution Instructions
Tailwind Config: Define custom animation keyframes for "shimmer" (a light streak that passes over cards every 5 seconds) and "float" (slow Y-axis bobbing for 3D images).

Asset Handling: Use placeholder="blur" for all large images to ensure the "Premium" feel isn't broken by pop-in.

Micro-animations: Add a 0.05s spring scale to every interactive element.

Cursor: Implement a custom "Spotlight" cursor that reveals the background grid only within a 200px radius of the mouse.

Next Step: Please generate the app/page.tsx structure and the Hero component, including the Tailwind classes for the "Glass-Edge" borders and the staggered Framer Motion entrance.