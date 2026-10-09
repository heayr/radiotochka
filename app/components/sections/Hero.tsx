"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";
import { radioAudio } from "@/lib/audio/radio-audio";

interface HeroProps {
  initialData?: Partial<HeroSectionData>;
}

// Прецизионные глифы Oswald Bold при fontSize=280 для идеального центрирования любого слова
const OSWALD_GLYPH_WIDTHS: Record<string, number> = {
  // Cyrillic
  "А": 154, "Б": 155, "В": 165, "Г": 130, "Д": 194, "Е": 125, "Ё": 125,
  "Ж": 223, "З": 147, "И": 165, "Й": 165, "К": 160, "Л": 184, "М": 197,
  "Н": 171, "О": 164, "П": 169, "Р": 160, "С": 158, "Т": 125, "У": 155,
  "Ф": 213, "Х": 144, "Ц": 190, "Ч": 171, "Ш": 231, "Щ": 249, "Ъ": 177,
  "Ы": 233, "Ь": 156, "Э": 161, "Ю": 231, "Я": 170,
  // Latin
  "A": 154, "B": 155, "C": 158, "D": 165, "E": 125, "F": 120, "G": 165,
  "H": 171, "I": 68, "J": 95, "K": 160, "L": 120, "M": 197, "N": 171,
  "O": 164, "P": 160, "Q": 164, "R": 160, "S": 147, "T": 125, "U": 165,
  "V": 155, "W": 225, "X": 144, "Y": 155, "Z": 145,
  " ": 70,
};

function getHeroTypography(word: string) {
  const cleanWord = (word || "МАРКЕТИНГ").trim().toUpperCase();
  let rawSum = 0;
  for (const c of cleanWord) {
    rawSum += OSWALD_GLYPH_WIDTHS[c] || 160;
  }
  const textWidth = Math.round(rawSum * 0.925);
  const padX = 57;
  const viewBoxTop = 38;
  const viewBoxHeight = 242;
  const textBaselineY = 260;
  const fontSize = 280;
  const viewBoxWidth = textWidth + padX * 2;
  const centerX = viewBoxWidth / 2;

  return {
    viewBox: `0 ${viewBoxTop} ${viewBoxWidth} ${viewBoxHeight}`,
    centerX,
    textBaselineY,
    fontSize,
    bannerWord: cleanWord,
    viewBoxWidth,
    viewBoxHeight,
    viewBoxTop,
  };
}

/**
 * Генерация SVG Path для столбиков спектрального эквалайзера
 */
function buildEqualizerBarsPath(
  width: number,
  numBars: number,
  heights: number[],
  yBase: number,
  barWidth: number
): string {
  const margin = 45;
  const avail = width - margin * 2;
  const step = avail / numBars;
  let d = "";

  for (let i = 0; i < numBars; i++) {
    const x = margin + i * step + (step - barWidth) / 2;
    const h = Math.max(14, heights[i]);
    const yTop = yBase - h;
    const r = Math.min(5, barWidth / 2);

    d += `M ${x + r} ${yTop} `;
    d += `H ${x + barWidth - r} `;
    d += `Q ${x + barWidth} ${yTop} ${x + barWidth} ${yTop + r} `;
    d += `V ${yBase} `;
    d += `H ${x} `;
    d += `V ${yTop + r} `;
    d += `Q ${x} ${yTop} ${x + r} ${yTop} Z `;
  }

  return d;
}

/**
 * Генерация пиковых меток эквалайзера (Peak Hold)
 */
function buildEqualizerPeaksPath(
  width: number,
  numBars: number,
  peaks: number[],
  yBase: number,
  barWidth: number
): string {
  const margin = 45;
  const avail = width - margin * 2;
  const step = avail / numBars;
  let d = "";

  for (let i = 0; i < numBars; i++) {
    const x = margin + i * step + (step - barWidth) / 2;
    const pY = yBase - peaks[i] - 7;
    d += `M ${x} ${pY} H ${x + barWidth} V ${pY + 4} H ${x} Z `;
  }

  return d;
}

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const rawWord = initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord;

  const { viewBox, centerX, textBaselineY, fontSize, bannerWord, viewBoxWidth, viewBoxTop, viewBoxHeight } =
    getHeroTypography(rawWord);

  const [mounted, setMounted] = useState(false);

  // SVG Refs для анимации эквалайзера
  const eqBarsRef = useRef<SVGPathElement>(null);
  const eqPeaksRef = useRef<SVGPathElement>(null);

  const activityRef = useRef(0);
  const targetMouseXRef = useRef(viewBoxWidth / 2);
  const currentMouseXRef = useRef(viewBoxWidth / 2);
  const isHoveredRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Анимационный цикл 60fps для эквалайзера
  useEffect(() => {
    if (!mounted) return;

    let animId: number;
    let phase = 0;

    const NUM_BARS = 44;
    const BAR_WIDTH = 22;

    const currentHeights = new Float32Array(NUM_BARS);
    const peakHeights = new Float32Array(NUM_BARS);

    // Начальные высоты эквалайзера, чтобы он сразу был виден на экране
    for (let i = 0; i < NUM_BARS; i++) {
      currentHeights[i] = 70 + Math.sin(i * 0.3) * 30;
      peakHeights[i] = currentHeights[i] + 10;
    }

    const margin = 45;
    const avail = viewBoxWidth - margin * 2;
    const step = avail / NUM_BARS;

    const render = () => {
      activityRef.current = Math.max(0, activityRef.current * 0.94);
      currentMouseXRef.current += (targetMouseXRef.current - currentMouseXRef.current) * 0.16;

      const act = activityRef.current;
      phase += 0.05 + act * 0.06;

      const mX = currentMouseXRef.current;
      const isHovered = isHoveredRef.current;

      for (let i = 0; i < NUM_BARS; i++) {
        const barCenterX = margin + i * step + step / 2;
        const distToMouse = Math.abs(barCenterX - mX) / 170;

        // При наведении мыши — мощный всплеск спектра вокруг курсора (до +90px)
        const mouseBoost = isHovered
          ? Math.exp(-distToMouse * distToMouse) * (65 + act * 75)
          : 0;

        // Живой танец спектроанализатора
        const wave1 = Math.sin(i * 0.42 + phase * 1.8) * 44;
        const wave2 = Math.cos(i * 0.78 - phase * 1.2) * 26;
        const wave3 = Math.sin(phase * 3.2 + i * 0.18) * 14;

        // Базовая высота: уверенно танцует от 50px до 125px (внутри букв)
        const baseH = 75 + wave1 + wave2 * 0.6 + wave3 * 0.4;
        const targetH = Math.min(195, Math.max(18, baseH + mouseBoost));

        // Плавная интерполяция
        currentHeights[i] += (targetH - currentHeights[i]) * 0.22;

        // Падение пиковых отметок (Peak hold с гравитацией)
        if (currentHeights[i] >= peakHeights[i]) {
          peakHeights[i] = currentHeights[i];
        } else {
          peakHeights[i] = Math.max(currentHeights[i], peakHeights[i] - 2.2);
        }
      }

      // Обновление SVG путей
      if (eqBarsRef.current) {
        eqBarsRef.current.setAttribute(
          "d",
          buildEqualizerBarsPath(viewBoxWidth, NUM_BARS, Array.from(currentHeights), textBaselineY, BAR_WIDTH)
        );
      }

      if (eqPeaksRef.current) {
        eqPeaksRef.current.setAttribute(
          "d",
          buildEqualizerPeaksPath(viewBoxWidth, NUM_BARS, Array.from(peakHeights), textBaselineY, BAR_WIDTH)
        );
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mounted, viewBoxWidth, textBaselineY]);

  // Разблокировка звука радио при первом жесте
  useEffect(() => {
    const unlock = () => radioAudio.ensureRunning();
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("mousemove", unlock, { once: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("mousemove", unlock);
    };
  }, []);

  // Интерактив при движении курсора
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const svgX = relX * viewBoxWidth;
      targetMouseXRef.current = svgX;

      const now = performance.now();
      const dt = Math.max(1, now - lastMoveTimeRef.current);
      const dist = Math.hypot(e.clientX - lastPosRef.current.x, e.clientY - lastPosRef.current.y);
      const speed = Math.min(1, dist / (dt * 0.6));

      lastPosRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTimeRef.current = now;

      activityRef.current = Math.min(1, activityRef.current + speed * 0.5 + 0.25);
      isHoveredRef.current = true;

      // Воспроизведение звука настройки радио (чистое шипение и пойманная станция)
      radioAudio.triggerTuning(relX, speed);
    },
    [viewBoxWidth]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isHoveredRef.current = true;
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      targetMouseXRef.current = relX * viewBoxWidth;
      currentMouseXRef.current = relX * viewBoxWidth;
    },
    [viewBoxWidth]
  );

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    radioAudio.fadeStop();
  }, []);

  return (
    <section id="hero" className="relative w-full bg-[#F3EFE8] pt-1 sm:pt-2 overflow-hidden">
      {/* Верхняя строка: копирайт и статус агентства */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 2xl:px-12 pt-2 sm:pt-3 flex items-center justify-between">
        <span className="text-[20px] sm:text-[32px] 2xl:text-[36px] font-bold text-[#0A0A0A] tracking-tight">
          {copyrightYear}
        </span>
        <span className="text-[14px] sm:text-[28px] 2xl:text-[30px] font-bold tracking-widest text-[#0A0A0A] uppercase">
          {agencyLabel}
        </span>
      </div>

      {/* 
        ГЛАВНЫЙ БАННЕР С НАДПИСЬЮ:
        Буквы наполнены живым, танцующим спектральным аудио-эквалайзером.
      */}
      <div
        className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 2xl:px-12 pt-2 sm:pt-3 pb-2 sm:pb-3 mb-[20px] 2xl:mb-[32px] select-none flex justify-center items-center cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          viewBox={viewBox}
          preserveAspectRatio="none"
          className="w-full h-[85px] sm:h-[180px] md:h-[230px] lg:h-[280px] xl:h-[295px] 2xl:h-[350px] 3xl:h-[380px] block overflow-hidden"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Базовый фирменный градиент */}
            <linearGradient id="heroRefinedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA5670" />
              <stop offset="50%" stopColor="#B35284" />
              <stop offset="100%" stopColor="#824E98" />
            </linearGradient>

            {/* Яркий спектральный градиент столбиков эквалайзера */}
            <linearGradient id="eqBarVividGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#EA5670" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#FF3366" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#FBBF24" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            {/* Маска по силуэту букв слова: эквалайзер живет строго внутри букв */}
            <clipPath id="heroWordClip" clipPathUnits="userSpaceOnUse">
              <text
                x={centerX}
                y={textBaselineY}
                textAnchor="middle"
                fontFamily="'Oswald', Impact, sans-serif"
                fontWeight="700"
                fontSize={fontSize}
                className="uppercase"
              >
                {bannerWord}
              </text>
            </clipPath>

            <mask id="heroWordMask" maskUnits="userSpaceOnUse" x="0" y="0" width={viewBoxWidth} height="400">
              <text
                x={centerX}
                y={textBaselineY}
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="'Oswald', Impact, sans-serif"
                fontWeight="700"
                fontSize={fontSize}
                className="uppercase"
              >
                {bannerWord}
              </text>
            </mask>
          </defs>

          {/* 
            1. БАЗОВЫЙ ПЛАКАТНЫЙ ТЕКСТ:
            Создает объемный фон букв с фирменным градиентом
          */}
          <text
            x={centerX}
            y={textBaselineY}
            textAnchor="middle"
            fill="url(#heroRefinedGradient)"
            fontFamily="'Oswald', Impact, sans-serif"
            fontWeight="700"
            fontSize={fontSize}
            className="uppercase"
            opacity="0.32"
          >
            {bannerWord}
          </text>

          {/* 
            2. ТАНЦУЮЩИЙ АУДИО-ЭКВАЛАЙЗЕР ВНУТРИ БУКВ:
            Замаскирован строго по контуру букв через clipPath и mask!
          */}
          <g mask="url(#heroWordMask)" className="pointer-events-none">
            {/* Яркие спектральные столбики эквалайзера */}
            <path ref={eqBarsRef} fill="url(#eqBarVividGradient)" />

            {/* Белые неоновые пиковые метки эквалайзера (Peak Hold) */}
            <path ref={eqPeaksRef} fill="#FFFFFF" opacity="0.95" />
          </g>
        </svg>
      </div>
    </section>
  );
}
