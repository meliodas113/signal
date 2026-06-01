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
import { useHashRoute } from "./useHashRoute";

export default function App() {
  const hash = useHashRoute();
  const isAbout = hash === "#/about";

  // Manage scroll position on route/anchor change.
  useEffect(() => {
    if (isAbout) {
      window.scrollTo({ top: 0 });
    } else if (/^#[a-zA-Z]/.test(hash)) {
      // In-page anchor (e.g. #why): scroll once the landing page has rendered.
      const id = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [hash, isAbout]);

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
