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
 * Генерация единого SVG Path для всех столбиков эквалайзера с закругленными верхушками
 */
function buildEqualizerBarsPath(
  width: number,
  numBars: number,
  heights: number[],
  yBase: number,
  barWidth: number
): string {
  const margin = 48;
  const avail = width - margin * 2;
  const step = avail / numBars;
  let d = "";

  for (let i = 0; i < numBars; i++) {
    const x = margin + i * step + (step - barWidth) / 2;
    const h = Math.max(5, heights[i]);
    const yTop = yBase - h;
    const r = Math.min(4, barWidth / 2);

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
 * Генерация пиковых меток эквалайзера (Peak Hold dots)
 */
function buildEqualizerPeaksPath(
  width: number,
  numBars: number,
  peaks: number[],
  yBase: number,
  barWidth: number
): string {
  const margin = 48;
  const avail = width - margin * 2;
  const step = avail / numBars;
  let d = "";

  for (let i = 0; i < numBars; i++) {
    const x = margin + i * step + (step - barWidth) / 2;
    const pY = yBase - peaks[i] - 6;
    d += `M ${x} ${pY} H ${x + barWidth} V ${pY + 3.5} H ${x} Z `;
  }

  return d;
}

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const rawWord = initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord;

  const { viewBox, centerX, textBaselineY, fontSize, bannerWord, viewBoxWidth, viewBoxTop, viewBoxHeight } =
    getHeroTypography(rawWord);

  const [isDesktop, setIsDesktop] = useState(false);

  // SVG Refs для эквалайзера и стрелки настройки
  const eqBarsRef = useRef<SVGPathElement>(null);
  const eqPeaksRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGLineElement>(null);

  const activityRef = useRef(0);
  const targetMouseXRef = useRef(viewBoxWidth / 2);
  const currentMouseXRef = useRef(viewBoxWidth / 2);
  const isHoveredRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef(0);

  // Включаем только на ПК с мышью
  useEffect(() => {
    const checkIsDesktop = () => {
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      const isWideScreen = window.innerWidth >= 1024;
      setIsDesktop(hasFinePointer && isWideScreen);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Разблокировка Web Audio API при первом жесте
  useEffect(() => {
    if (!isDesktop) return;

    const unlockAudio = () => {
      radioAudio.ensureRunning();
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("mousemove", unlockAudio, { once: true, passive: true });
    window.addEventListener("keydown", unlockAudio, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("mousemove", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [isDesktop]);

  // Анимационный цикл эквалайзера 60-120fps
  useEffect(() => {
    if (!isDesktop) return;

    let animId: number;
    let phase = 0;

    const NUM_BARS = 48;
    const BAR_WIDTH = 20;
    const STATIONS_POS = [0.18, 0.50, 0.82];

    const currentHeights = new Float32Array(NUM_BARS);
    const peakHeights = new Float32Array(NUM_BARS);

    const margin = 48;
    const avail = viewBoxWidth - margin * 2;
    const step = avail / NUM_BARS;

    const render = () => {
      activityRef.current = Math.max(0, activityRef.current * 0.94);
      currentMouseXRef.current += (targetMouseXRef.current - currentMouseXRef.current) * 0.15;

      const act = activityRef.current;
      phase += 0.045 + act * 0.08;

      const mX = currentMouseXRef.current;
      const xRatio = mX / viewBoxWidth;

      // Проверка наведения на радиостанцию
      const isLocked = STATIONS_POS.some((pos) => Math.abs(xRatio - pos) < 0.055);

      for (let i = 0; i < NUM_BARS; i++) {
        const barCenterX = margin + i * step + step / 2;
        const distToMouse = Math.abs(barCenterX - mX) / 160;
        const mouseBoost = Math.exp(-distToMouse * distToMouse) * act * 155;

        // Гармонический ритм эквалайзера
        let dynamicH = 0;
        if (isLocked) {
          // Танцующий музыкальный спектр пойманной радиостанции
          const beat1 = Math.sin(i * 0.38 + phase * 2.2) * 50;
          const beat2 = Math.cos(i * 0.72 - phase * 1.6) * 35;
          const beat3 = Math.sin(phase * 4.0) * 20;
          dynamicH = 45 + Math.abs(beat1 + beat2 + beat3) * 0.9 + mouseBoost * 0.8;
        } else if (act > 0.05) {
          // Реакция на движение мыши в эфире: спектральные всплески
          const wave = Math.sin(i * 0.5 + phase) * 35 + Math.sin(i * 1.3 - phase * 1.8) * 25;
          dynamicH = 12 + Math.abs(wave) * act + mouseBoost;
        } else {
          // Мягкое фоновое дыхание эквалайзера в покое
          const idleWave = Math.sin(i * 0.28 + phase * 0.7) * 9 + Math.cos(i * 0.45 - phase * 0.5) * 6;
          dynamicH = 12 + Math.abs(idleWave);
        }

        // Ограничение максимальной высоты внутри букв
        const targetH = Math.min(195, Math.max(6, dynamicH));

        // Плавная интерполяция высоты столбика
        currentHeights[i] += (targetH - currentHeights[i]) * 0.28;

        // Гравитационное падение пиковых точек (Peak Hold)
        if (currentHeights[i] >= peakHeights[i]) {
          peakHeights[i] = currentHeights[i];
        } else {
          peakHeights[i] = Math.max(currentHeights[i], peakHeights[i] - 1.8);
        }
      }

      // Обновление SVG путей столбиков и пиков напрямую в DOM
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

      // Стрелка настройки радио (tuner needle)
      if (needleRef.current) {
        if (isHoveredRef.current) {
          needleRef.current.setAttribute("x1", mX.toFixed(1));
          needleRef.current.setAttribute("x2", mX.toFixed(1));
          const opacity = Math.min(1, act * 0.7 + 0.4);
          needleRef.current.setAttribute("opacity", opacity.toFixed(2));
        } else {
          needleRef.current.setAttribute("opacity", "0");
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      radioAudio.fadeStop();
    };
  }, [isDesktop, viewBoxWidth, textBaselineY]);

  // Движение мыши над надписью
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDesktop) return;

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

      activityRef.current = Math.min(1, activityRef.current + speed * 0.45 + 0.2);
      isHoveredRef.current = true;

      // Воспроизведение звука лампового радио
      radioAudio.triggerTuning(relX, speed);
    },
    [isDesktop, viewBoxWidth]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDesktop) return;
      isHoveredRef.current = true;
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      targetMouseXRef.current = relX * viewBoxWidth;
      currentMouseXRef.current = relX * viewBoxWidth;
    },
    [isDesktop, viewBoxWidth]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isDesktop) return;
    isHoveredRef.current = false;
    radioAudio.fadeStop();
  }, [isDesktop]);

  return (
    <section id="hero" className="relative w-full bg-[#F3EFE8] pt-1 sm:pt-2 overflow-hidden">
      {/* 
        =====================================================================
        ВЕРХНЯЯ СТРОКА: Исходный дизайн (год и статус агентства без лишних кнопок)
        =====================================================================
      */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 2xl:px-12 pt-2 sm:pt-3 flex items-center justify-between">
        <span className="text-[20px] sm:text-[32px] 2xl:text-[36px] font-bold text-[#0A0A0A] tracking-tight">
          {copyrightYear}
        </span>
        <span className="text-[14px] sm:text-[28px] 2xl:text-[30px] font-bold tracking-widest text-[#0A0A0A] uppercase">
          {agencyLabel}
        </span>
      </div>

      {/* 
        =====================================================================
        ГЛАВНЫЙ БАННЕР С НАДПИСЬЮ (МАРКЕТИНГ):
        Буквы ВСЕГДА на 100% видны в фирменном градиенте.
        На ПК внутри букв анимируются столбики живого аудио-эквалайзера!
        =====================================================================
      */}
      <div
        className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 2xl:px-12 pt-2 sm:pt-3 pb-2 sm:pb-3 mb-[20px] 2xl:mb-[32px] select-none flex justify-center items-center cursor-pointer"
        onMouseMove={isDesktop ? handleMouseMove : undefined}
        onMouseEnter={isDesktop ? handleMouseEnter : undefined}
        onMouseLeave={isDesktop ? handleMouseLeave : undefined}
      >
        <svg
          viewBox={viewBox}
          preserveAspectRatio="none"
          className="w-full h-[85px] sm:h-[180px] md:h-[230px] lg:h-[280px] xl:h-[295px] 2xl:h-[350px] 3xl:h-[380px] block overflow-hidden"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroRefinedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA5670" />
              <stop offset="50%" stopColor="#B35284" />
              <stop offset="100%" stopColor="#824E98" />
            </linearGradient>

            {/* Градиент столбиков эквалайзера (от фирменного розового до неонового белого верха) */}
            <linearGradient id="eqBarGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#EA5670" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FF6584" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#FBBF24" stopOpacity="0.98" />
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
          </defs>

          {/* 
            1. БАЗОВЫЙ ПЛАКАТНЫЙ ТЕКСТ:
            Всегда отображается напрямую! Никогда не пропадает ни на мобилках, ни на ПК.
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
          >
            {bannerWord}
          </text>

          {/* 
            2. СЛОЙ ЖИВОГО АУДИО-ЭКВАЛАЙЗЕРА (ТОЛЬКО НА ПК):
            Замаскирован строго по силуэту букв слова «МАРКЕТИНГ»!
          */}
          {isDesktop && (
            <g clipPath="url(#heroWordClip)" className="pointer-events-none">
              {/* Столбики спектрального эквалайзера */}
              <path ref={eqBarsRef} fill="url(#eqBarGradient)" />

              {/* Пиковые отметки эквалайзера (Peak Hold) */}
              <path ref={eqPeaksRef} fill="#FFFFFF" opacity="0.95" />

              {/* Тонкая вертикальная визирная стрелка шкалы тюнера */}
              <line
                ref={needleRef}
                x1="0"
                y1={viewBoxTop}
                x2="0"
                y2={viewBoxTop + viewBoxHeight}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0"
              />
            </g>
          )}
        </svg>
      </div>
    </section>
  );
}
