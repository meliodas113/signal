import { useEffect } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { StatStrip } from "./components/StatStrip";
import { WhyDifferent } from "./components/WhyDifferent";
import { HowItWorks } from "./components/HowItWorks";
import { SampleMatch } from "./components/SampleMatch";
import { Pricing } from "./components/Pricing";
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
          <StatStrip />
          <WhyDifferent />
          <HowItWorks />
          <SampleMatch />
          <Pricing />
          <FinalCTA />
        </>
      )}
      <Footer />
    </div>
  );
}
