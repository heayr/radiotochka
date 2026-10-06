"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";

interface HeroProps {
  initialData?: Partial<HeroSectionData>;
}

// Карта пропорций ширин символов Oswald Bold для мгновенного точного SSR-расчета
const OSWALD_CHAR_WIDTHS: Record<string, number> = {
  // Широкие символы
  "Ж": 0.88, "Ш": 0.88, "Щ": 0.90, "Ю": 0.84, "М": 0.78, "W": 0.88, "M": 0.82,
  // Узкие символы
  "I": 0.30, "І": 0.30, "Ї": 0.30, "J": 0.38, "1": 0.42,
  // Стандартные символы
  "А": 0.64, "Б": 0.62, "В": 0.62, "Г": 0.54, "Д": 0.66, "Е": 0.58, "Ё": 0.58,
  "З": 0.58, "И": 0.66, "Й": 0.66, "К": 0.62, "Л": 0.64, "Н": 0.66, "О": 0.66,
  "П": 0.66, "Р": 0.60, "С": 0.62, "Т": 0.58, "У": 0.60, "Ф": 0.74, "Х": 0.62,
  "Ц": 0.68, "Ч": 0.60, "Ъ": 0.70, "Ы": 0.80, "Ь": 0.60, "Э": 0.60, "Я": 0.64,
  // Latin
  "A": 0.64, "B": 0.62, "C": 0.62, "D": 0.66, "E": 0.58, "F": 0.54, "G": 0.66,
  "H": 0.66, "K": 0.62, "L": 0.54, "N": 0.66, "O": 0.66, "P": 0.60, "R": 0.60,
  "S": 0.58, "T": 0.58, "U": 0.66, "V": 0.62, "X": 0.62, "Y": 0.60, "Z": 0.58,
  " ": 0.35,
};

function estimateTextWidth(word: string, fontSize: number): number {
  let totalRatio = 0;
  for (const char of word.toUpperCase()) {
    totalRatio += OSWALD_CHAR_WIDTHS[char] || 0.64;
  }
  // Запас 3% для исключения любого обрезания до гидратации
  return Math.ceil(totalRatio * fontSize * 1.03);
}

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const bannerWord = (initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord).trim().toUpperCase();

  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState<string>(() => {
    const estW = estimateTextWidth(bannerWord, 280);
    return `0 50 ${estW} 220`;
  });

  // Прецизионный расчет реальных границ рендеринга текста в браузере (getBBox)
  useEffect(() => {
    const updateBBox = () => {
      if (textRef.current) {
        try {
          const b = textRef.current.getBBox();
          if (b && b.width > 0 && b.height > 0) {
            // Безопасный отступ 6px для сглаживания и антиалиасинга
            const padX = 6;
            const padY = 4;
            setViewBox(
              `${Math.floor(b.x - padX)} ${Math.floor(b.y - padY)} ${Math.ceil(b.width + padX * 2)} ${Math.ceil(b.height + padY * 2)}`
            );
          }
        } catch {
          // fallback на оценочные размеры
        }
      }
    };

    updateBBox();

    // Перепроверяем после гарантированной загрузки веб-шрифта
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(updateBBox);
    }
  }, [bannerWord]);

  return (
    <section id="hero" className="relative w-full bg-[#F3EFE8] pt-1 sm:pt-2 overflow-hidden">
      {/* Hero Header: Copyright & Agency Label */}
      <div className="w-full px-[24px] sm:px-[30px] lg:px-[60px] pt-3 sm:pt-4 flex items-center justify-between">
        <span className="text-[26px] sm:text-[32px] font-bold text-[#0A0A0A] tracking-tight">
          {copyrightYear}
        </span>
        <span className="text-[20px] sm:text-[28px] font-bold tracking-widest text-[#0A0A0A] uppercase">
          {agencyLabel}
        </span>
      </div>

      {/* Hero Banner: Монументальная адаптивная плакатная SVG-типографика без обрезания границ */}
      <div className="w-full px-3 sm:px-6 lg:px-10 pt-0 sm:pt-1 pb-1 sm:pb-2 select-none">
        <svg
          viewBox={viewBox}
          preserveAspectRatio="none"
          className="w-full h-[180px] xs:h-[220px] sm:h-[300px] md:h-[380px] lg:h-[450px] xl:h-[500px] block"
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

          {/* Плакатный текст: Oswald bold, монументальный и адаптивный под любой текст из админки */}
          <text
            ref={textRef}
            x="0"
            y="260"
            fill="url(#heroRefinedGradient)"
            fontFamily="'Oswald', Impact, sans-serif"
            fontWeight="700"
            fontSize="280"
            className="uppercase"
          >
            {bannerWord}
          </text>
        </svg>
      </div>
    </section>
  );
}
