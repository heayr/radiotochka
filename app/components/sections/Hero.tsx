import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";

interface HeroProps {
  initialData?: Partial<HeroSectionData>;
}

/**
 * Вычисляет адаптивные параметры плакатной SVG типографики
 * под любую длину и наполнение слова из админки (МАРКЕТИНГ, МАРКЕТИНГА, РЕКЛАМА и др.):
 * - fontSize: монументальный кегль по высоте
 * - viewBoxHeight: плотный габарит по высоте без пустых дыр
 * - baselineY: выверенная посадка базовой линии
 */
function getAdaptiveHeroTypography(word: string) {
  const cleanWord = word.trim() || "МАРКЕТИНГ";
  const len = cleanWord.length;

  // Динамическая адаптивная формула кегля:
  // Для 10 букв ("МАРКЕТИНГА") дает мощный кегль ~275px, для 9 букв ~295px, для 8 букв ~320px
  const fontSize = Math.min(
    330,
    Math.max(180, Math.round(1400 / (len * 0.50)))
  );

  const viewBoxHeight = Math.round(fontSize * 1.12);
  const baselineY = Math.round(fontSize * 0.91);

  return {
    fontSize,
    viewBoxHeight,
    baselineY,
  };
}

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const bannerWord = (initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord).trim().toUpperCase();

  const { fontSize, viewBoxHeight, baselineY } = getAdaptiveHeroTypography(bannerWord);

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

      {/* Hero Banner: Монументальная адаптивная SVG-типографика на всю ширину экрана */}
      <div className="w-full px-3 sm:px-6 lg:px-10 pt-3 sm:pt-5 pb-3 sm:pb-5 select-none">
        <svg
          viewBox={`0 0 1400 ${viewBoxHeight}`}
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

          {/* Адаптивное монументальное заполнение по высоте и ширине без деформации пропорций */}
          <text
            x="0"
            y={baselineY}
            textLength="1400"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#heroRefinedGradient)"
            fontFamily="'Onest', -apple-system, BlinkMacSystemFont, sans-serif"
            fontWeight="500"
            fontSize={fontSize}
            className="uppercase"
          >
            {bannerWord}
          </text>
        </svg>
      </div>
    </section>
  );
}
