import Hero from "./components/sections/Hero";
import Stats from "./components/sections/Stats";
import Marquee from "./components/sections/Marquee";
import Manifesto from "./components/sections/Manifesto";
import LogoSection from "./components/LogoSection";
import RadioStations from "./components/RadioStations";
import Services from "./components/Services";
import AdCalculator from "./components/AdCalculator";
import Proposal from "./components/Proposal";
import Cases from "./components/Cases";
import { ContactInfo } from "./components/sections/ContactInfo";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />
      <Stats />
      <Marquee />
      <Manifesto />
      <LogoSection />
      <RadioStations />
      <Services />
      <AdCalculator />
      <Proposal />
      <Cases />
      <ContactInfo />
      <Footer />
    </main>
  );
}
