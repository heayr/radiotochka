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

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const rawWord = initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord;

  const { viewBox, centerX, textBaselineY, fontSize, bannerWord, viewBoxWidth, viewBoxTop, viewBoxHeight } =
    getHeroTypography(rawWord);

  const [mounted, setMounted] = useState(false);

  // SVG Refs для анимации неонового визира шкалы радио
  const tunerGroupRef = useRef<SVGGElement>(null);
  const tunerGlowBeamRef = useRef<SVGRectElement>(null);
  const tunerNeedleRef = useRef<SVGLineElement>(null);
  const tunerStationFlareRef = useRef<SVGRectElement>(null);
  const tunerIndicatorTopRef = useRef<SVGCircleElement>(null);
  const tunerIndicatorBottomRef = useRef<SVGCircleElement>(null);

  const targetMouseXRef = useRef(viewBoxWidth / 2);
  const currentMouseXRef = useRef(viewBoxWidth / 2);
  const visibilityRef = useRef(0);
  const isHoveredRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Анимационный цикл 60fps для неонового визира радио
  useEffect(() => {
    if (!mounted) return;

    let animId: number;
    const RADIO_STATION_POSITIONS = [0.18, 0.50, 0.82];

    const render = () => {
      // Плавное следование за курсором (lerp)
      currentMouseXRef.current += (targetMouseXRef.current - currentMouseXRef.current) * 0.22;

      // Управление видимостью: если мышь наведена и двигалась — плавно проявляем, иначе мягко растворяем
      const isHovered = isHoveredRef.current;
      const now = performance.now();
      const isRecentlyMoved = now - lastMoveTimeRef.current < 220;

      if (isHovered && isRecentlyMoved) {
        visibilityRef.current = Math.min(1, visibilityRef.current + 0.16);
      } else {
        // Мягкое плавное угасание в покое (буквы остаются идеально чистыми)
        visibilityRef.current = Math.max(0, visibilityRef.current * 0.90);
      }

      const vis = visibilityRef.current;

      if (tunerGroupRef.current) {
        if (vis < 0.005) {
          tunerGroupRef.current.style.opacity = "0";
        } else {
          const curX = currentMouseXRef.current;
          tunerGroupRef.current.setAttribute("transform", `translate(${curX.toFixed(1)}, 0)`);
          tunerGroupRef.current.style.opacity = vis.toFixed(3);

          // Расчет попадания на радиостанцию (золотистое свечение)
          const xRatio = Math.max(0, Math.min(1, curX / viewBoxWidth));
          let minDist = 999;
          for (const pos of RADIO_STATION_POSITIONS) {
            const d = Math.abs(xRatio - pos);
            if (d < minDist) minDist = d;
          }

          const lockRadius = 0.045;
          const isLocking = minDist < lockRadius;
          const lockStrength = isLocking ? Math.pow(1 - minDist / lockRadius, 1.4) : 0;

          // Вспышка захвата станции
          if (tunerStationFlareRef.current) {
            tunerStationFlareRef.current.style.opacity = (lockStrength * 0.92).toFixed(3);
          }

          // Неоновая игла
          if (tunerNeedleRef.current) {
            const strokeColor = lockStrength > 0.1 ? "#FFFBEB" : "#FFFFFF";
            const strokeWidth = (3.2 + lockStrength * 2.8).toFixed(1);
            tunerNeedleRef.current.setAttribute("stroke", strokeColor);
            tunerNeedleRef.current.setAttribute("stroke-width", strokeWidth);
          }

          // Точечные индикаторы
          const dotColor = lockStrength > 0.1 ? "#FBBF24" : "#FFFFFF";
          const dotRadius = (3.5 + lockStrength * 2).toFixed(1);
          if (tunerIndicatorTopRef.current) {
            tunerIndicatorTopRef.current.setAttribute("fill", dotColor);
            tunerIndicatorTopRef.current.setAttribute("r", dotRadius);
          }
          if (tunerIndicatorBottomRef.current) {
            tunerIndicatorBottomRef.current.setAttribute("fill", dotColor);
            tunerIndicatorBottomRef.current.setAttribute("r", dotRadius);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mounted, viewBoxWidth]);

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
      isHoveredRef.current = true;

      // Мягкое воспроизведение звука настройки радио (тихий шепот эфира и пойманная станция)
      radioAudio.triggerTuning(relX, speed);
    },
    [viewBoxWidth]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isHoveredRef.current = true;
      lastMoveTimeRef.current = performance.now();
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
        100% сочные, яркие фирменные буквы.
        При движении мыши по шкале скользит неоновый визир радиочастоты со световым ореолом.
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
            {/* Базовый фирменный градиент (100% насыщенный и сочный) */}
            <linearGradient id="heroRefinedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA5670" />
              <stop offset="50%" stopColor="#B35284" />
              <stop offset="100%" stopColor="#824E98" />
            </linearGradient>

            {/* Мягкий неоновый ореол луча визира (горизонтальное рассеивание света) */}
            <linearGradient id="tunerGlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="35%" stopColor="#FFA6BD" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#FFA6BD" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Золотисто-белый акцент при фиксации на волне станции */}
            <linearGradient id="tunerStationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0" />
              <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
            </linearGradient>

            {/* Высокоточная маска по контурам букв */}
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
            100% сочный, яркий фирменный градиент без выцветания
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
            opacity="1"
          >
            {bannerWord}
          </text>

          {/* 
            2. НЕОНОВЫЙ ВИЗИР РАДИОЧАСТОТЫ:
            Скользит внутри букв строго по контуру (через mask), подсвечивая их изнутри
          */}
          <g mask="url(#heroWordMask)" className="pointer-events-none">
            <g ref={tunerGroupRef} style={{ opacity: 0 }}>
              {/* Мягкий рассеянный световой луч визира (ширина 140px) */}
              <rect
                ref={tunerGlowBeamRef}
                x="-70"
                y={viewBoxTop}
                width="140"
                height={viewBoxHeight}
                fill="url(#tunerGlowGradient)"
              />

              {/* Золотистая вспышка при попадании на радиостанцию */}
              <rect
                ref={tunerStationFlareRef}
                x="-90"
                y={viewBoxTop}
                width="180"
                height={viewBoxHeight}
                fill="url(#tunerStationGradient)"
                opacity="0"
              />

              {/* Центральная неоновая игла визира настройки */}
              <line
                ref={tunerNeedleRef}
                x1="0"
                y1={viewBoxTop}
                x2="0"
                y2={viewBoxTop + viewBoxHeight}
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Верхний и нижний маркеры шкалы */}
              <circle ref={tunerIndicatorTopRef} cx="0" cy={viewBoxTop + 14} r="4" fill="#FFFFFF" />
              <circle ref={tunerIndicatorBottomRef} cx="0" cy={viewBoxTop + viewBoxHeight - 14} r="4" fill="#FFFFFF" />
            </g>
          </g>
        </svg>
      </div>
    </section>
  );
}
