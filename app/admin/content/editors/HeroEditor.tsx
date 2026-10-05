"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import { DEFAULT_HERO_DATA, type HeroSectionData } from "@/types/site-content";

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
          <h4 className="text-base font-bold text-gray-900">
            🌟 Главный экран (Hero)
          </h4>
          <p className="text-xs text-gray-500">
            Верхняя плакатная часть сайта с фирменным градиентным шрифтом и лейблом агентства.
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
          Текст растягивается оптически по всей ширине макета (1320px) в градиенте фирменных цветов.
        </p>
      </div>

      {/* Живое превью */}
      <div className="bg-[#F3EFE8] rounded-xl p-6 border border-[#E0D8CB]">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
          Мини-превью на сайте
        </span>
        <div className="flex items-center justify-between text-black font-bold mb-4 text-sm">
          <span>{copyrightYear}</span>
          <span className="tracking-widest uppercase">{agencyLabel}</span>
        </div>
        <div className="text-center font-extrabold text-2xl sm:text-4xl uppercase tracking-widest text-[#ea5670] bg-clip-text">
          {bannerWord}
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
