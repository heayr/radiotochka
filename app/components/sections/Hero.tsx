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
  // Учитываем парный кернинг в сплошном тексте Oswald
  const textWidth = Math.round(rawSum * 0.925);

  // =========================================================================
  // 🎛 НАСТРОЙКИ ПОЗИЦИОНИРОВАНИЯ БУКВ ВНУТРИ SVG (МЕНЯЙ ЗДЕСЬ):
  // =========================================================================

  // 1. Боковой запас слева и справа (px):
  //    Гарантирует, что крайние ножки букв «М» и «А» не будут срезаться рамкой SVG.
  //    Увеличь (например, 60 или 70), если хочешь ещё больше воздуха по бокам.
  const padX = 57;

  // 2. Верхняя граница окна SVG (viewBox Y):
  //    Уменьшаешь (например, 20 или 25) -> буквы опускаются ниже внутри блока.
  //    Увеличиваешь (например, 45 или 50) -> буквы поднимаются выше.
  const viewBoxTop = 38;

  // 3. Высота окна SVG (viewBox Height):
  //    Чем меньше число (например, 230) -> буквы сильнее вытягиваются в высоту.
  //    Чем больше число (например, 260) -> буквы становятся чуть ниже и компактнее.
  const viewBoxHeight = 242;

  // 4. Базовая линия шрифта (Y посадки текста):
  //    260 — идеальная оптическая посадка для кегля 280.
  //    Увеличиваешь -> буквы смещаются вниз; уменьшаешь -> вверх.
  const textBaselineY = 260;

  // 5. Кегль шрифта внутри SVG:
  const fontSize = 280;

  // Итоговая ширина окна SVG с учетом текста и боковых отступов
  const viewBoxWidth = textWidth + padX * 2;
  // Центр по горизонтали: текст всегда идеально отцентрирован, ни один край не обрежется
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

function generateWavePath(
  width: number,
  centerY: number,
  baseAmp: number,
  freq: number,
  phase: number,
  mouseX: number,
  activity: number
): string {
  const step = 22;
  let d = "";

  for (let x = 0; x <= width + step; x += step) {
    const curX = Math.min(x, width);
    // Сглаживание амплитуды у краев баннера
    const edgeRatio = curX / width;
    const envelope = Math.sin(edgeRatio * Math.PI);

    // Локальное возмущение/резонанс вокруг курсора мыши
    const distToMouse = (curX - mouseX) / 160;
    const mouseBoost = Math.exp(-distToMouse * distToMouse) * activity * 1.5;

    // Сложение гармонических синусоид для аутентичной звуковой осциллограммы
    const s1 = Math.sin(curX * freq + phase);
    const s2 = Math.sin(curX * freq * 2.2 - phase * 1.3) * 0.45;
    const s3 = Math.cos(curX * freq * 0.55 + phase * 0.75) * 0.3;

    const dynamicAmp = (baseAmp + activity * 22 + mouseBoost * 30) * envelope;
    const curY = centerY + (s1 + s2 + s3) * dynamicAmp;

    if (x === 0) {
      d += `M ${curX.toFixed(1)} ${curY.toFixed(1)}`;
    } else {
      d += ` L ${curX.toFixed(1)} ${curY.toFixed(1)}`;
    }
  }

  return d;
}

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const rawWord = initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord;

  const { viewBox, centerX, textBaselineY, fontSize, bannerWord, viewBoxWidth, viewBoxHeight, viewBoxTop } =
    getHeroTypography(rawWord);

  // Центр букв по вертикали для оси звуковой волны
  const centerY = 160;

  // Определение десктопной версии (мышь + экран от 1024px)
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // SVG Refs для анимации 60fps без ререндеров React
  const wave1Ref = useRef<SVGPathElement>(null);
  const wave2Ref = useRef<SVGPathElement>(null);
  const wave3Ref = useRef<SVGPathElement>(null);
  const wave4Ref = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGLineElement>(null);

  // Интерактивное состояние курсора
  const activityRef = useRef(0);
  const targetMouseXRef = useRef(viewBoxWidth / 2);
  const currentMouseXRef = useRef(viewBoxWidth / 2);
  const isHoveredRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef(0);

  // Проверка устройства: включаем ТОЛЬКО на ПК с физической мышью
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

  // Анимационный цикл requestAnimationFrame для десктопа
  useEffect(() => {
    if (!isDesktop) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      // Плавное затухание возбуждения волны
      activityRef.current = Math.max(0, activityRef.current * 0.94);

      // Плавное следование за курсором
      currentMouseXRef.current += (targetMouseXRef.current - currentMouseXRef.current) * 0.12;

      const act = activityRef.current;
      // В спокойном состоянии волна дышит медленно, при движении ускоряется
      phase += 0.035 + act * 0.085;

      const mX = currentMouseXRef.current;

      // 1. Белый яркий луч несущей частоты
      if (wave1Ref.current) {
        wave1Ref.current.setAttribute(
          "d",
          generateWavePath(viewBoxWidth, centerY, 14, 0.011, phase, mX, act)
        );
      }

      // 2. Неоново-розовая радиоволна
      if (wave2Ref.current) {
        wave2Ref.current.setAttribute(
          "d",
          generateWavePath(viewBoxWidth, centerY + 3, 11, 0.016, -phase * 0.9 + 1.2, mX, act)
        );
      }

      // 3. Кибер-пурпурная гармоника
      if (wave3Ref.current) {
        wave3Ref.current.setAttribute(
          "d",
          generateWavePath(viewBoxWidth, centerY - 3, 9, 0.022, phase * 1.3 + 2.5, mX, act)
        );
      }

      // 4. Тонкие высокочастотные колебания (помехи эфира)
      if (wave4Ref.current) {
        wave4Ref.current.setAttribute(
          "d",
          generateWavePath(viewBoxWidth, centerY, 6, 0.031, -phase * 1.6, mX, act)
        );
      }

      // Стрелка радио-тюнера
      if (needleRef.current) {
        if (isHoveredRef.current) {
          needleRef.current.setAttribute("x1", mX.toFixed(1));
          needleRef.current.setAttribute("x2", mX.toFixed(1));
          const opacity = Math.min(0.9, act * 0.7 + 0.3);
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
  }, [isDesktop, viewBoxWidth, centerY]);

  // Обработчик движения мыши (активен только на ПК)
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
      const speed = Math.min(1, dist / (dt * 0.7));

      lastPosRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTimeRef.current = now;

      activityRef.current = Math.min(1, activityRef.current + speed * 0.4 + 0.15);
      isHoveredRef.current = true;

      // Запуск процедурного синтезатора радио
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

  const handleToggleMute = () => {
    const nextMuted = radioAudio.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <section id="hero" className="relative w-full bg-[#F3EFE8] pt-1 sm:pt-2 overflow-hidden">
      {/* 
        =====================================================================
        ВЕРХНЯЯ СТРОКА: Год копирайта и статус агентства
        - pt-2 sm:pt-3: отступ сверху от шапки меню
        - px-4 sm:px-8 lg:px-[60px]: боковые отступы по краям экрана
        =====================================================================
      */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 2xl:px-12 pt-2 sm:pt-3 flex items-center justify-between">
        <span className="text-[20px] sm:text-[32px] 2xl:text-[36px] font-bold text-[#0A0A0A] tracking-tight">
          {copyrightYear}
        </span>

        <div className="flex items-center gap-4">
          {/* Индикатор/переключатель звука радио (только для ПК) */}
          {isDesktop && (
            <button
              onClick={handleToggleMute}
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all bg-[#0A0A0A]/5 hover:bg-[#0A0A0A]/10 text-[#0A0A0A]/75 hover:text-[#0A0A0A] border border-[#0A0A0A]/10 cursor-pointer select-none"
              title="Звук настройки радиоприемника при движении курсора"
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isMuted ? "bg-neutral-400" : "bg-emerald-500 animate-pulse"
                }`}
              />
              <span>📻 104.2 FM • ЗВУК: {isMuted ? "ВЫКЛ" : "ВКЛ"}</span>
            </button>
          )}

          <span className="text-[14px] sm:text-[28px] 2xl:text-[30px] font-bold tracking-widest text-[#0A0A0A] uppercase">
            {agencyLabel}
          </span>
        </div>
      </div>

      {/* 
        =====================================================================
        ГЛАВНЫЙ БАННЕР С НАДПИСЬЮ (МАРКЕТИНГ):
        
        На мобильных — статический плакатный текст Oswald без нагрузки.
        На ПК — живые волны звука строго внутри маски букв + интерактивное радио-аудио.
        =====================================================================
      */}
      <div
        className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 2xl:px-12 pt-2 sm:pt-3 pb-2 sm:pb-3 mb-[20px] 2xl:mb-[32px] select-none flex justify-center items-center"
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

            {/* Маска по силуэту букв слова: ни один пиксель волны не выходит за их рамки */}
            {isDesktop && (
              <clipPath id="heroWordClip">
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
            )}
          </defs>

          {!isDesktop ? (
            /* Мобильная версия: чистый плакатный текст без накладных расходов */
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
          ) : (
            /* ПК версия: живые радиоволны осциллографа внутри маски букв */
            <g clipPath="url(#heroWordClip)">
              {/* Базовый фирменный градиент слова */}
              <rect
                x="0"
                y={viewBoxTop}
                width={viewBoxWidth}
                height={viewBoxHeight}
                fill="url(#heroRefinedGradient)"
              />

              {/* Звуковые волны осциллографа */}
              <g className="mix-blend-screen pointer-events-none">
                {/* Волна 1: Яркий белый луч несущей частоты радиостанции */}
                <path
                  ref={wave1Ref}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.95"
                />

                {/* Волна 2: Неоново-розовая гармоника */}
                <path
                  ref={wave2Ref}
                  fill="none"
                  stroke="#FF88A8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Волна 3: Кибер-пурпурная радиоволна */}
                <path
                  ref={wave3Ref}
                  fill="none"
                  stroke="#E2A8FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.75"
                />

                {/* Волна 4: Золотистая искра накала радиолампы */}
                <path
                  ref={wave4Ref}
                  fill="none"
                  stroke="#FDE047"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />

                {/* Шкала настройки: вертикальная стрелка тюнера */}
                <line
                  ref={needleRef}
                  x1="0"
                  y1={viewBoxTop}
                  x2="0"
                  y2={viewBoxTop + viewBoxHeight}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  opacity="0"
                />
              </g>
            </g>
          )}
        </svg>
      </div>
    </section>
  );
}
