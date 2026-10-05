import Hero from "./components/sections/Hero";
import Stats from "./components/sections/Stats";
import Marquee from "./components/sections/Marquee";
import Manifesto from "./components/sections/Manifesto";
import Process from "./components/sections/Process";
import Services from "./components/Services";
import Work from "./components/sections/Work";
import Footer from "./components/Footer";
import { getContentBlockSafe } from "@/lib/services/content.service";
import {
  DEFAULT_SERVICES_DATA,
  DEFAULT_WORK_DATA,
  DEFAULT_PROCESS_DATA,
  DEFAULT_STATS_DATA,
  DEFAULT_MANIFESTO_DATA,
  type ServicesSectionData,
  type WorkSectionData,
  type ProcessSectionData,
  type StatsSectionData,
  type ManifestoSectionData,
} from "@/types/site-content";

// Обеспечивает обновление контента на горячую при редактировании через модерацию
export const dynamic = "force-dynamic";

export default async function Home() {
  const [servicesData, workData, processData, statsData, manifestoData] =
    await Promise.all([
      getContentBlockSafe<ServicesSectionData>("services", DEFAULT_SERVICES_DATA),
      getContentBlockSafe<WorkSectionData>("work", DEFAULT_WORK_DATA),
      getContentBlockSafe<ProcessSectionData>("process", DEFAULT_PROCESS_DATA),
      getContentBlockSafe<StatsSectionData>("stats", DEFAULT_STATS_DATA),
      getContentBlockSafe<ManifestoSectionData>("manifesto", DEFAULT_MANIFESTO_DATA),
    ]);

  return (
    <div className="w-full overflow-x-clip">
      <Hero />
      <Stats initialData={statsData} />
      <Marquee />
      <Manifesto initialData={manifestoData} />
      <Process initialData={processData} />
      <Services initialData={servicesData} />
      <Work initialData={workData} />
      <Footer />
    </div>
  );
}
