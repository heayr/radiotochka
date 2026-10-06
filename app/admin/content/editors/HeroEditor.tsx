"use client";

import React, { useState, useRef, useEffect } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";

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
  const padX = 45;
  const viewBoxWidth = textWidth + padX * 2;
  const centerX = viewBoxWidth / 2;

  return {
    viewBox: `0 36 ${viewBoxWidth} 242`,
    centerX,
    bannerWord: cleanWord,
  };
}

function HeroPreviewSvg({ word }: { word: string }) {
  const { viewBox, centerX, bannerWord } = getHeroTypography(word);

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className="w-full h-[120px] sm:h-[150px] md:h-[175px] block overflow-hidden"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="previewBrandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EA5670" />
          <stop offset="50%" stopColor="#B35284" />
          <stop offset="100%" stopColor="#824E98" />
        </linearGradient>
      </defs>
      <text
        x={centerX}
        y="260"
        textAnchor="middle"
        fill="url(#previewBrandGradient)"
        fontFamily="'Oswald', Impact, sans-serif"
        fontWeight="700"
        fontSize="280"
        className="uppercase"
      >
        {bannerWord}
      </text>
    </svg>
  );
}

export function HeroEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<HeroSectionData>;

  const [copyrightYear, setCopyrightYear] = useState(
    content.copyrightYear || DEFAULT_HERO_DATA.copyrightYear
  );
  const [agencyLabel, setAgencyLabel] = useState(
    content.agencyLabel || DEFAULT_HERO_DATA.agencyLabel
  );
  const [bannerWord, setBannerWord] = useState(
    content.bannerWord || DEFAULT_HERO_DATA.bannerWord
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleResetToDefault = () => {
    if (confirm("Сбросить главный экран к значениям по умолчанию?")) {
      setCopyrightYear(DEFAULT_HERO_DATA.copyrightYear);
      setAgencyLabel(DEFAULT_HERO_DATA.agencyLabel);
      setBannerWord(DEFAULT_HERO_DATA.bannerWord);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data: HeroSectionData = {
        copyrightYear,
        agencyLabel,
        bannerWord,
      };
      await onSave(data as unknown as Record<string, unknown>);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Главный экран (Hero)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Копирайт, статус агентства и монументальная адаптивная SVG-типографика.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResetToDefault}
        >
          Вернуть по умолчанию
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Копирайт слева вверху
          </label>
          <input
            type="text"
            value={copyrightYear}
            onChange={(e) => setCopyrightYear(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="©2026"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Лейбл справа вверху
          </label>
          <input
            type="text"
            value={agencyLabel}
            onChange={(e) => setAgencyLabel(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="AGENCY"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Плакатное слово на всю ширину (SVG Typography)
        </label>
        <input
          type="text"
          value={bannerWord}
          onChange={(e) => setBannerWord(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none font-mono tracking-widest uppercase font-bold"
          placeholder="МАРКЕТИНГ"
          required
        />
        <p className="text-[11px] text-gray-400 mt-1">
          Текст адаптивно растягивается по высоте и ширине экрана в фирменном градиенте.
        </p>
      </div>

      {/* Живое превью */}
      <div className="bg-[#F3EFE8] rounded-xl p-5 border border-[#E0D8CB] space-y-3">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
          Мини-превью на сайте (реальный SVG-баннер)
        </span>
        <div className="flex items-center justify-between text-black font-bold text-xs sm:text-sm px-2">
          <span>{copyrightYear}</span>
          <span className="tracking-widest uppercase">{agencyLabel}</span>
        </div>
        <div className="w-full select-none bg-[#F3EFE8] rounded-lg overflow-hidden">
          <HeroPreviewSvg word={bannerWord} />
        </div>
      </div>

      <EditorFormFooter
        isLoading={isLoading}
        onCancel={onCancel}
        saveLabel="Сохранить главный экран"
      />
    </form>
  );
}
