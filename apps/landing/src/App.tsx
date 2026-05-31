import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { StatStrip } from "./components/StatStrip";
import { WhyDifferent } from "./components/WhyDifferent";
import { HowItWorks } from "./components/HowItWorks";
import { SampleMatch } from "./components/SampleMatch";
import { Pricing } from "./components/Pricing";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <StatStrip />
      <WhyDifferent />
      <HowItWorks />
      <SampleMatch />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
