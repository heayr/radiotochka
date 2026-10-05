import Hero from "./components/sections/Hero";
import Stats from "./components/sections/Stats";
import Marquee from "./components/sections/Marquee";
import Manifesto from "./components/sections/Manifesto";
import Process from "./components/sections/Process";
import Services from "./components/Services";
import Work from "./components/sections/Work";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="w-full overflow-x-clip">
      <Hero />
      <Stats />
      <Marquee />
      <Manifesto />
      <Process />
      <Services />
      <Work />
      <Footer />
    </div>
  );
}
