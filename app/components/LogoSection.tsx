import React, { memo } from "react";
import SafeImage from "./SafeImage";
import {
  DEFAULT_LOGO_SECTION_DATA,
  type LogoItem,
  type LogoSectionData,
} from "@/types/site-content";

const defaultLogos: LogoItem[] = [
  { src: "", alt: "+Shift", name: "Shift", type: "shift" },
  { src: "", alt: "BuildingBlocks", name: "BuildingBlocks", type: "building-blocks" },
  { src: "", alt: "Capsule", name: "Capsule", type: "capsule" },
  { src: "", alt: "45 Degrees°", name: "45 Degrees°", type: "45-degrees" },
  { src: "", alt: "Acme", name: "Acme", type: "acme" },
  { src: "/images/dorozhnoe.svg", alt: "Дорожное Радио", name: "Дорожное Радио", type: "image" },
  { src: "/images/nashe.svg", alt: "Наше Радио", name: "Наше Радио", type: "image" },
];

interface ClientCardProps {
  item: LogoItem;
}

const ClientCard = memo(function ClientCard({ item }: ClientCardProps) {
  return (
    <div
      className="bg-white rounded-[24px] sm:rounded-[30px] border border-[#E5DFD5]/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-w-[270px] sm:min-w-[320px] lg:min-w-[340px] h-[120px] sm:h-[135px] flex items-center justify-center px-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md select-none shrink-0"
    >
      {item.type === "shift" || item.alt === "+Shift" ? (
        <div className="flex items-center gap-2 text-[#0A0A0A] font-bold text-[26px] sm:text-[28px] tracking-tight">
          <span className="text-[28px] sm:text-[30px] font-black leading-none select-none">+</span>
          <span className="font-sans font-bold">Shift</span>
        </div>
      ) : item.type === "building-blocks" || item.alt === "BuildingBlocks" ? (
        <div className="flex items-center gap-3 text-[#0A0A0A] font-bold text-[23px] sm:text-[25px] tracking-tight">
          <svg
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 text-[#0A0A0A]"
            viewBox="0 0 28 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2L20 5.5L14 9L8 5.5L14 2Z" />
            <path d="M8 5.5V12.5L14 16V9" />
            <path d="M20 5.5V12.5L14 16" />
            <path d="M8 12.5L2 16V23L8 26.5V19.5" />
            <path d="M2 16L8 19.5L14 16" />
            <path d="M20 12.5L14 16V23L20 26.5V19.5" />
            <path d="M20 19.5L26 16V23L20 26.5" />
            <path d="M26 16L20 12.5" />
          </svg>
          <span className="font-sans font-bold">BuildingBlocks</span>
        </div>
      ) : item.type === "capsule" || item.alt === "Capsule" ? (
        <div className="flex items-center gap-3 text-[#0A0A0A] font-bold text-[25px] sm:text-[27px] tracking-tight">
          <svg className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 text-[#0A0A0A]" viewBox="0 0 28 28" fill="currentColor">
            <rect x="3" y="10" width="16" height="8" rx="4" transform="rotate(-35 11 14)" />
            <circle cx="19" cy="17" r="4.5" />
          </svg>
          <span className="font-sans font-bold">Capsule</span>
        </div>
      ) : item.type === "45-degrees" || item.alt === "45 Degrees°" ? (
        <div className="flex items-center gap-3 text-[#0A0A0A] font-bold text-[24px] sm:text-[26px] tracking-tight">
          <div className="w-10 h-10 rounded-[12px] bg-[#141414] text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
            </svg>
          </div>
          <span className="font-sans font-bold">45 Degrees°</span>
        </div>
      ) : item.type === "acme" || item.alt === "Acme" ? (
        <div className="flex items-center gap-3 text-[#0A0A0A] font-bold text-[25px] sm:text-[27px] tracking-tight">
          <div className="w-10 h-10 rounded-[12px] bg-[#141414] text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" />
            </svg>
          </div>
          <span className="font-sans font-bold">Acme</span>
        </div>
      ) : item.src ? (
        <div className="flex items-center justify-center px-4">
          <SafeImage
            src={item.src}
            alt={item.alt}
            width={160}
            height={52}
            className="h-11 sm:h-12 w-auto max-w-[170px] object-contain"
          />
        </div>
      ) : (
        <span className="font-bold text-xl text-[#0A0A0A] tracking-tight">{item.alt}</span>
      )}
    </div>
  );
});

export interface LogoSectionProps {
  initialData?: Partial<LogoSectionData>;
}

export default function LogoSection({ initialData }: LogoSectionProps) {
  const title = initialData?.title || DEFAULT_LOGO_SECTION_DATA.title || "Наши клиенты";
  const subtitle = initialData?.subtitle || DEFAULT_LOGO_SECTION_DATA.subtitle || "Работали с более чем 100+ брендами в регионе";
  const subtext = initialData?.subtext || DEFAULT_LOGO_SECTION_DATA.subtext || "Ритейл · Авто · Недвижимость · Сфера услуг · Медицина";
  const logos =
    initialData?.logos && initialData.logos.length > 0
      ? initialData.logos
      : DEFAULT_LOGO_SECTION_DATA.logos;

  return (
    <section id="clients" className="w-full bg-[#F4F0EB] pt-6 sm:pt-10 pb-20 sm:pb-28">
      {/* Заголовок и подзаголовок в точном соответствии с референсом */}
      <div className="px-[20px] sm:px-[30px] lg:px-[60px] mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#0A0A0A] tracking-[-0.03em] leading-tight">
            {title}
          </h2>
          <div className="text-left md:text-right text-[#7E7971] text-xs sm:text-[14px] leading-relaxed select-none">
            <p className="font-medium text-[#4A4742]">{subtitle}</p>
            <p className="text-[#8E8B85]">{subtext}</p>
          </div>
        </div>
      </div>

      {/* Бегущий трек карточек брендов */}
      <div className="w-full overflow-hidden py-3">
        <div className="animate-cards-marquee flex items-center gap-4 sm:gap-6 pl-4 sm:pl-6">
          {/* 1-й цикл */}
          {logos.map((item, idx) => (
            <ClientCard key={`card-1-${idx}-${item.alt}`} item={item} />
          ))}
          {/* 2-й цикл (для непрерывного бесконечного скролла) */}
          {logos.map((item, idx) => (
            <ClientCard key={`card-2-${idx}-${item.alt}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { defaultLogos };
