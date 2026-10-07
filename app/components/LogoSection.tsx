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
  const Component = item.href ? "a" : "div";
  const linkProps = item.href
    ? {
        href: item.href,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  const scale = item.scale ?? 100;
  const scaleStyle: React.CSSProperties =
    scale !== 100 ? { transform: `scale(${scale / 100})` } : {};

  const filterClass =
    item.filter === "grayscale"
      ? "grayscale contrast-125"
      : item.filter === "invert"
      ? "invert"
      : "";

  let cardContent: React.ReactNode = null;

  // Если у логотипа есть src (ссылка, загруженный с ПК файл data:image или путь /images/...),
  // ВСЕГДА отображаем изображение в первую очередь!
  if (item.src && item.src.trim() !== "") {
    cardContent = (
      <div
        className="flex items-center justify-center px-2 sm:px-4 w-full h-full transition-transform duration-200"
        style={scaleStyle}
      >
        <SafeImage
          src={item.src}
          alt={item.alt || item.name || "Логотип клиента"}
          width={240}
          height={70}
          className={`h-9 sm:h-12 md:h-14 w-auto max-w-[170px] sm:max-w-[230px] lg:max-w-[270px] object-contain transition-all duration-300 ${filterClass}`}
        />
      </div>
    );
  } else if (item.type === "shift" || item.alt === "+Shift") {
    cardContent = (
      <div className="flex items-center gap-1.5 sm:gap-2 text-[#0A0A0A] font-bold text-[18px] sm:text-[26px] tracking-tight">
        <span className="text-[20px] sm:text-[28px] font-black leading-none select-none">+</span>
        <span className="font-sans font-bold">Shift</span>
      </div>
    );
  } else if (item.type === "building-blocks" || item.alt === "BuildingBlocks") {
    cardContent = (
      <div className="flex items-center gap-2 sm:gap-3 text-[#0A0A0A] font-bold text-[16px] sm:text-[23px] tracking-tight">
        <svg
          className="w-5 h-5 sm:w-8 sm:h-8 shrink-0 text-[#0A0A0A]"
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
    );
  } else if (item.type === "capsule" || item.alt === "Capsule") {
    cardContent = (
      <div className="flex items-center gap-2 sm:gap-3 text-[#0A0A0A] font-bold text-[17px] sm:text-[25px] tracking-tight">
        <svg className="w-5 h-5 sm:w-8 sm:h-8 shrink-0 text-[#0A0A0A]" viewBox="0 0 28 28" fill="currentColor">
          <rect x="3" y="10" width="16" height="8" rx="4" transform="rotate(-35 11 14)" />
          <circle cx="19" cy="17" r="4.5" />
        </svg>
        <span className="font-sans font-bold">Capsule</span>
      </div>
    );
  } else if (item.type === "45-degrees" || item.alt === "45 Degrees°") {
    cardContent = (
      <div className="flex items-center gap-2 sm:gap-3 text-[#0A0A0A] font-bold text-[16px] sm:text-[24px] tracking-tight">
        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-[8px] sm:rounded-[12px] bg-[#141414] text-white flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
          </svg>
        </div>
        <span className="font-sans font-bold">45 Degrees°</span>
      </div>
    );
  } else if (item.type === "acme" || item.alt === "Acme") {
    cardContent = (
      <div className="flex items-center gap-2 sm:gap-3 text-[#0A0A0A] font-bold text-[17px] sm:text-[25px] tracking-tight">
        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-[8px] sm:rounded-[12px] bg-[#141414] text-white flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" />
          </svg>
        </div>
        <span className="font-sans font-bold">Acme</span>
      </div>
    );
  } else {
    cardContent = (
      <span className="font-bold text-base sm:text-xl text-[#0A0A0A] tracking-tight">
        {item.alt || item.name || "Клиент"}
      </span>
    );
  }

  return (
    <Component
      {...linkProps}
      className={`group/card relative bg-white rounded-[16px] sm:rounded-[28px] border border-[#E5DFD5]/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] min-w-[170px] sm:min-w-[280px] lg:min-w-[340px] 2xl:min-w-[360px] h-[72px] sm:h-[110px] lg:h-[135px] 2xl:h-[145px] flex items-center justify-center px-4 sm:px-8 transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#ea5670]/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] select-none shrink-0 ${
        item.href ? "cursor-pointer" : ""
      }`}
    >
      <div className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out group-hover/card:scale-[1.02]">
        {cardContent}
      </div>
      {item.href && (
        <span
          className="absolute top-2.5 right-3.5 text-xs text-gray-400 group-hover/card:text-[#ea5670] opacity-0 group-hover/card:opacity-100 transition-all select-none"
          title="Открыть сайт партнера"
        >
          ↗
        </span>
      )}
    </Component>
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

  // Динамическая адаптивная длительность анимации:
  // При 4 циклах дорожки (2 в каждой половине) скорость остается комфортной (~3с на карточку в цикле)
  const animationDuration = `${Math.max(48, logos.length * 2 * 3.2)}s`;

  // Формируем 2 идентичные половины дорожки. В каждой половине — по 2 прогона списка логотипов.
  // Это гарантирует, что первая половина имеет ширину > 4800px, что с огромным запасом перекрывает 2K (2560px) и Ultrawide (3440px).
  const halfLogos = logos.concat(logos);

  return (
    <section id="clients" className="w-full bg-[#F4F0EB] pt-6 sm:pt-10 pb-20 sm:pb-28 2xl:pb-36">
      {/* Заголовок и подзаголовок в точном соответствии с референсом */}
      <div className="w-full max-w-[1680px] mx-auto px-[20px] sm:px-[30px] lg:px-10 2xl:px-12 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] 2xl:text-[64px] font-bold text-[#0A0A0A] tracking-[-0.03em] leading-tight">
            {title}
          </h2>
          <div className="text-left md:text-right text-[#7E7971] text-xs sm:text-[14px] 2xl:text-[16px] leading-relaxed select-none">
            <p className="font-medium text-[#4A4742]">{subtitle}</p>
            <p className="text-[#8E8B85]">{subtext}</p>
          </div>
        </div>
      </div>

      {/* Бегущий трек карточек брендов с контейнерной паузой и градиентными краями */}
      <div className="marquee-container w-full overflow-hidden py-4 relative [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        <div
          className="animate-cards-marquee flex items-center gap-4 sm:gap-6 pr-4 sm:pr-6"
          style={{ animationDuration }}
        >
          {/* 1-я половина дорожки (гарантированно шире 2K и Ultrawide мониторов) */}
          {halfLogos.map((item, idx) => (
            <ClientCard key={`card-1-${idx}-${item.alt}`} item={item} />
          ))}
          {/* 2-я половина дорожки (идентичный дубликат для бесконечного плавного сдвига -50%) */}
          {halfLogos.map((item, idx) => (
            <ClientCard key={`card-2-${idx}-${item.alt}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { defaultLogos };
