import Hero from "./components/sections/Hero";
import Stats from "./components/sections/Stats";
import Marquee from "./components/sections/Marquee";
import Manifesto from "./components/sections/Manifesto";
import LogoSection from "./components/sections/LogoSection";
import Process from "./components/sections/Process";
import Services from "./components/sections/Services";
import Work from "./components/sections/Work";
import Footer from "./components/layout/Footer";
import { getContentBlockSafe } from "@/lib/services/content.service";
import {
  DEFAULT_SERVICES_DATA,
  DEFAULT_WORK_DATA,
  DEFAULT_PROCESS_DATA,
  DEFAULT_STATS_DATA,
  DEFAULT_MANIFESTO_DATA,
  DEFAULT_HERO_DATA,
  DEFAULT_MARQUEE_DATA,
  DEFAULT_FOOTER_DATA,
  DEFAULT_LOGO_SECTION_DATA,
  type ServicesSectionData,
  type WorkSectionData,
  type ProcessSectionData,
  type StatsSectionData,
  type ManifestoSectionData,
  type HeroSectionData,
  type MarqueeSectionData,
  type FooterSectionData,
  type LogoSectionData,
} from "@/types/site-content";

// Обеспечивает обновление контента на горячую при редактировании через модерацию
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    heroData,
    statsData,
    marqueeData,
    manifestoData,
    logoSectionData,
    processData,
    servicesData,
    workData,
    footerData,
  ] = await Promise.all([
    getContentBlockSafe<HeroSectionData>("hero", DEFAULT_HERO_DATA),
    getContentBlockSafe<StatsSectionData>("stats", DEFAULT_STATS_DATA),
    getContentBlockSafe<MarqueeSectionData>("marquee", DEFAULT_MARQUEE_DATA),
    getContentBlockSafe<ManifestoSectionData>("manifesto", DEFAULT_MANIFESTO_DATA),
    getContentBlockSafe<LogoSectionData>("logo-section", DEFAULT_LOGO_SECTION_DATA),
    getContentBlockSafe<ProcessSectionData>("process", DEFAULT_PROCESS_DATA),
    getContentBlockSafe<ServicesSectionData>("services", DEFAULT_SERVICES_DATA),
    getContentBlockSafe<WorkSectionData>("work", DEFAULT_WORK_DATA),
    getContentBlockSafe<FooterSectionData>("footer", DEFAULT_FOOTER_DATA),
  ]);

  return (
    <div className="w-full overflow-x-clip">
      <Hero initialData={heroData} />
      <Stats initialData={statsData} />
      <Marquee initialData={marqueeData} />
      <Manifesto initialData={manifestoData} />
      <LogoSection initialData={logoSectionData} />
      <Process initialData={processData} />
      <Services initialData={servicesData} />
      <Work initialData={workData} />
      <Footer initialData={footerData} />
    </div>
  );
}

