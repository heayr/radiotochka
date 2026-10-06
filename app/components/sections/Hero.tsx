import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";

interface HeroProps {
  initialData?: Partial<HeroSectionData>;
}

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const bannerWord = (initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord).trim().toUpperCase();
  const len = bannerWord.length || 9;
  // Адаптивный расчет размера шрифта для идеальной посадки и изящного трекинга без деформации глифов
  const optimalFontSize = len <= 7 ? 240 : len <= 9 ? 220 : len <= 11 ? 190 : 160;

  return (
    <section id="hero" className="relative w-full bg-[#F3EFE8] pt-2 sm:pt-4 overflow-hidden">
      {/* Hero Header: Copyright & Agency Label */}
      <div className="w-full px-[24px] sm:px-[30px] lg:px-[60px] pt-6 sm:pt-8 flex items-center justify-between">
        <span className="text-[26px] sm:text-[32px] font-bold text-[#0A0A0A] tracking-tight">
          {copyrightYear}
        </span>
        <span className="text-[20px] sm:text-[28px] font-bold tracking-widest text-[#0A0A0A] uppercase">
          {agencyLabel}
        </span>
      </div>

      {/* Hero Banner: Giant SVG Typography в точности по эталону футера */}
      <div className="w-full px-[20px] sm:px-[30px] lg:px-[60px] pt-4 sm:pt-6 pb-4 sm:pb-6 select-none">
        <svg
          viewBox="0 0 1400 300"
          className="w-full h-auto block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroRefinedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA5670" />
              <stop offset="50%" stopColor="#B35284" />
              <stop offset="100%" stopColor="#824E98" />
            </linearGradient>
          </defs>

          {/* Эталонная типографика: Onest, тонкое начертание 200, чистый трекинг spacing без сплющивания */}
          <text
            x="0"
            y="240"
            textLength="1400"
            lengthAdjust="spacing"
            fill="url(#heroRefinedGradient)"
            fontFamily="'Onest', -apple-system, BlinkMacSystemFont, sans-serif"
            fontWeight="200"
            fontSize={optimalFontSize}
            className="uppercase"
          >
            {bannerWord}
          </text>
        </svg>
      </div>
    </section>
  );
}
