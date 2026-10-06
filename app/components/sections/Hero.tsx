"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";

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
  const viewBoxTop = 36;

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
  };
}

export default function Hero({ initialData }: HeroProps) {
  const copyrightYear = initialData?.copyrightYear || DEFAULT_HERO_DATA.copyrightYear;
  const agencyLabel = initialData?.agencyLabel || DEFAULT_HERO_DATA.agencyLabel;
  const rawWord = initialData?.bannerWord || DEFAULT_HERO_DATA.bannerWord;

  const { viewBox, centerX, textBaselineY, fontSize, bannerWord } = getHeroTypography(rawWord);

  return (
    <section id="hero" className="relative w-full bg-[#F3EFE8] pt-1 sm:pt-2 overflow-hidden">
      {/* 
        =====================================================================
        ВЕРХНЯЯ СТРОКА: Год копирайта и статус агентства
        - pt-2 sm:pt-3: отступ сверху от шапки меню
        - px-4 sm:px-8 lg:px-[60px]: боковые отступы по краям экрана
        =====================================================================
      */}
      <div className="w-full px-4 sm:px-8 lg:px-[60px] pt-2 sm:pt-3 flex items-center justify-between">
        <span className="text-[20px] sm:text-[32px] font-bold text-[#0A0A0A] tracking-tight">
          {copyrightYear}
        </span>
        <span className="text-[14px] sm:text-[28px] font-bold tracking-widest text-[#0A0A0A] uppercase">
          {agencyLabel}
        </span>
      </div>

      {/* 
        =====================================================================
        ГЛАВНЫЙ БАННЕР С НАДПИСЬЮ (МАРКЕТИНГА):
        
        ОТСТУПЫ СНАРУЖИ:
        - pt-2 sm:pt-3: расстояние от верхней строки (©2026 / АГЕНТСТВО) до надписи
        - mb-[20px]: отступ СНИЗУ от букв до следующего блока со студией (задай любое число)
        - px-4 sm:px-8 lg:px-12: отступы от краев экрана
        
        ВЫСОТА НАДПИСИ (в классе svg):
        - h-[85px]    -> на смартфонах (до 640px)
        - sm:h-[180px]-> на больших телефонах
        - md:h-[230px]-> на планшетах
        - lg:h-[280px]-> на ноутбуках и ПК (эталон)
        - xl:h-[295px]-> на больших мониторах
        =====================================================================
      */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-2 sm:pt-3 pb-2 sm:pb-3 mb-[20px] select-none flex justify-center items-center">
        <svg
          viewBox={viewBox}
          preserveAspectRatio="none"
          className="w-full h-[85px] sm:h-[180px] md:h-[230px] lg:h-[280px] xl:h-[295px] block overflow-hidden"
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

          {/* Плакатный текст: Oswald bold, монументальный и центрированный без обрезания */}
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
        </svg>
      </div>
    </section>
  );
}
