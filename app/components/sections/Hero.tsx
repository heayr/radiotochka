import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";

interface HeroProps {
  initialData?: Partial<HeroSectionData>;
}

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const bannerWord = (initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord).trim().toUpperCase();
  const len = bannerWord.length || 9;
  // Адаптивный расчет размера шрифта и ширины строки для безупречной посадки любого слова
  const optimalFontSize = len <= 8 ? 245 : len <= 10 ? 230 : 210;
  const textLength = Math.min(1330, Math.max(1200, 1400 - (len > 10 ? 50 : 80)));

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

      {/* Hero Banner: Giant SVG Typography */}
      <div className="w-full px-[20px] sm:px-[30px] lg:px-[60px] pt-7 sm:pt-9 pb-6 sm:pb-8 select-none">
        <svg
          viewBox="0 0 1400 380"
          className="w-full h-auto max-h-[500px] block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Кинематографичный плакатный градиент в фирменных цветах Радиоточки */}
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea5670" />
              <stop offset="14%" stopColor="#f07389" />
              <stop offset="30%" stopColor="#824e98" />
              <stop offset="47%" stopColor="#2c1038" />
              <stop offset="64%" stopColor="#ea5670" />
              <stop offset="82%" stopColor="#ad3557" />
              <stop offset="100%" stopColor="#431c57" />
            </linearGradient>
          </defs>

          {/* Плакатный текст: центрирован с гарантированным запасом сверху, снизу и по краям */}
          <text
            x="700"
            y="300"
            textAnchor="middle"
            textLength={textLength}
            lengthAdjust="spacingAndGlyphs"
            fill="url(#brandGradient)"
            fontFamily="'Oswald', Impact, sans-serif"
            fontWeight="600"
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
