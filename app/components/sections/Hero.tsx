export default function Hero() {
  return (
    <section id="hero" className="relative w-full bg-[#F3EFE8] pt-2 sm:pt-4 overflow-hidden">
      {/* Hero Header: Copyright & Agency Label */}
      <div className="w-full px-[24px] sm:px-[30px] lg:px-[60px] pt-6 sm:pt-8 flex items-center justify-between">
        <span className="text-[26px] sm:text-[32px] font-bold text-[#0A0A0A] tracking-tight">
          ©2026
        </span>
        <span className="text-[20px] sm:text-[28px] font-bold tracking-widest text-[#0A0A0A] uppercase">
          AGENCY
        </span>
      </div>

      {/* Hero Banner: Giant SVG Typography */}
      <div className="w-full px-[20px] sm:px-[30px] lg:px-[60px] pt-7 sm:pt-9 pb-6 sm:pb-8 select-none">
        <svg
          viewBox="0 0 1320 360"
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

          {/* Текст растянут строго по ширине 1320px и плакатной высоте */}
          <text
            x="0"
            y="350"
            textLength="1320"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#brandGradient)"
            fontFamily="'Oswald', Impact, sans-serif"
            fontWeight="500"
            fontSize="290"
            className="uppercase scale-y-[1.4] origin-bottom"
          >
            МАРКЕТИНГ
          </text>
        </svg>
      </div>
    </section>
  );
}
