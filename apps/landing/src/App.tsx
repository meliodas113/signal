import { useEffect } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { AgencyWall } from "./components/AgencyWall";
import { StatStrip } from "./components/StatStrip";
import { TryItDemo } from "./components/TryItDemo";
import { WhyDifferent } from "./components/WhyDifferent";
import { HowItWorks } from "./components/HowItWorks";
import { DeadlineTicker } from "./components/DeadlineTicker";
import { SampleMatch } from "./components/SampleMatch";
import { Compare } from "./components/Compare";
import { ValueCalculator } from "./components/ValueCalculator";
import { Pricing } from "./components/Pricing";
import { WaitlistProof } from "./components/WaitlistProof";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { About } from "./pages/About";
import { usePathname, migrateLegacyHash } from "./router";

export default function App() {
  const path = usePathname();
  const isAbout = path === "/about";

  // Redirect any old hash URLs (#/about, #why) to the new clean paths.
  useEffect(() => {
    migrateLegacyHash();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      {isAbout ? (
        <About />
      ) : (
        <>
          <Hero />
          <AgencyWall />
          <StatStrip />
          <TryItDemo />
          <WhyDifferent />
          <HowItWorks />
          <DeadlineTicker />
          <SampleMatch />
          <Compare />
          <ValueCalculator />
          <Pricing />
          <WaitlistProof />
          <FinalCTA />
        </>
      )}
      <Footer />
    </div>
  );
}
