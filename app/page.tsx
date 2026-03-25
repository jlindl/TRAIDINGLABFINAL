import Hero from "./components/hero";
import Features from "./components/features";
import Workflow from "./components/workflow";
import MarketData from "./components/market-data";
import RoadmapCTA from "./components/roadmap-cta";
import StickyJourney from "./components/sticky-journey";
import SpotlightCursor from "./components/spotlight-cursor";

export default function Home() {
  return (
    <>
      <SpotlightCursor />

      {/* Fixed background grid */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0 opacity-40" />

      <div className="relative z-10">
        <Hero />
        <StickyJourney key="sticky-v2" />
        <Features />
        <Workflow key="workflow-v2" />
        <RoadmapCTA />
        <MarketData />
      </div>
    </>
  );
}
