"use client";

import React, { useState, useRef, useEffect } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";

// Карта пропорций ширин символов Oswald Bold для мгновенного точного превью
const OSWALD_CHAR_WIDTHS: Record<string, number> = {
  "Ж": 0.88, "Ш": 0.88, "Щ": 0.90, "Ю": 0.84, "М": 0.78, "W": 0.88, "M": 0.82,
  "I": 0.30, "І": 0.30, "Ї": 0.30, "J": 0.38, "1": 0.42,
  "А": 0.64, "Б": 0.62, "В": 0.62, "Г": 0.54, "Д": 0.66, "Е": 0.58, "Ё": 0.58,
  "З": 0.58, "И": 0.66, "Й": 0.66, "К": 0.62, "Л": 0.64, "Н": 0.66, "О": 0.66,
  "П": 0.66, "Р": 0.60, "С": 0.62, "Т": 0.58, "У": 0.60, "Ф": 0.74, "Х": 0.62,
  "Ц": 0.68, "Ч": 0.60, "Ъ": 0.70, "Ы": 0.80, "Ь": 0.60, "Э": 0.60, "Я": 0.64,
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
  return Math.ceil(totalRatio * fontSize * 1.03);
}

function HeroPreviewSvg({ word }: { word: string }) {
  const textRef = useRef<SVGTextElement>(null);
  const cleanWord = (word || DEFAULT_HERO_DATA.bannerWord).trim().toUpperCase();
  const [viewBox, setViewBox] = useState<string>(() => {
    const estW = estimateTextWidth(cleanWord, 280);
    return `0 36 ${estW} 242`;
  });

  useEffect(() => {
    const updateBBox = () => {
      if (textRef.current) {
        try {
          const b = textRef.current.getBBox();
          if (b && b.width > 0 && b.height > 0) {
            const padY = 16;
            const padX = 6;
            const capTop = 52 - padY;
            const capHeight = 210 + padY * 2;
            setViewBox(
              `${Math.floor(b.x - padX)} ${capTop} ${Math.ceil(b.width + padX * 2)} ${capHeight}`
            );
          }
        } catch {}
      }
    };
    updateBBox();
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(updateBBox);
    }
  }, [cleanWord]);

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className="w-full h-[120px] sm:h-[150px] md:h-[175px] block"
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
        ref={textRef}
        x="0"
        y="260"
        fill="url(#previewBrandGradient)"
        fontFamily="'Oswald', Impact, sans-serif"
        fontWeight="700"
        fontSize="280"
        className="uppercase"
      >
        {cleanWord}
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
