"use client";

import React, { useState } from "react";
import Button from "@/app/components/ui/Button";
import { EditorFormFooter } from "./EditorFormFooter";
import { ImageField } from "./ImageField";
import type { EditorProps } from "./editor-types";
import {
  DEFAULT_NAVBAR_DATA,
  type NavbarSectionData,
} from "@/types/site-content";

const LOGO_PRESETS = [
  {
    id: "clean-extra",
    title: "Экстра-чистый (крупный шрифт, без дескриптора)",
    description: "Рекомендуется для хедера: крупный читаемый текст «РАДИОТОЧКА» без мелкого дескриптора",
    badge: "Рекомендуется 🔥",
    mode: "image" as const,
    logoSrc: "/images/Radiotochka logo horizontal EXTRA CLEAN.svg",
    logoHeight: 40,
    text: "Радиоточка",
  },
  {
    id: "bigger-desc",
    title: "Крупный с дескриптором (+32%)",
    description: "Название и дескриптор увеличены на 32% для лучшей резкости",
    badge: "С дескриптором",
    mode: "image" as const,
    logoSrc: "/images/Radiotochka logo horizontal BIGGER descriptor.svg",
    logoHeight: 40,
    text: "Радиоточка",
  },
  {
    id: "big-user",
    title: "Вектор BIG (исходный файл пользователя)",
    description: "Файл Radiotochka logo horizontal BIG.svg",
    badge: "User Vector",
    mode: "image" as const,
    logoSrc: "/images/Radiotochka logo horizontal BIG.svg",
    logoHeight: 40,
    text: "Радиоточка",
  },
  {
    id: "horizontal-1",
    title: "Горизонтальный v1 (базовый)",
    description: "Первый отрисованный векторный вариант логотипа",
    badge: "Вектор v1",
    mode: "image" as const,
    logoSrc: "/images/Radiotochka logo horizontal.svg",
    logoHeight: 40,
    text: "Радиоточка",
  },
  {
    id: "split-old",
    title: "Старый вариант (Иконка + отдельный текст)",
    description: "Иконка main-logo.svg слева + отдельный текстовый тег <span>Радиоточка</span>",
    badge: "Старый вариант",
    mode: "split" as const,
    logoSrc: "/images/main-logo.svg",
    logoHeight: 34,
    text: "Радиоточка",
  },
  {
    id: "symbol-only",
    title: "Только знак (без текста)",
    description: "Только круглый знак: буква «Р» + волны + точка",
    badge: "Иконка",
    mode: "image" as const,
    logoSrc: "/images/Radiotochka logo only.svg",
    logoHeight: 38,
    text: "Радиоточка",
  },
];

export function NavbarEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content as Record<string, unknown>) || {};

  const [mode, setMode] = useState<"image" | "split" | "text">(
    (content.mode as "image" | "split" | "text") || DEFAULT_NAVBAR_DATA.mode
  );
  const [logoSrc, setLogoSrc] = useState<string>(
    (content.logoSrc as string) || DEFAULT_NAVBAR_DATA.logoSrc
  );
  const [logoAlt, setLogoAlt] = useState<string>(
    (content.logoAlt as string) || DEFAULT_NAVBAR_DATA.logoAlt
  );
  const [text, setText] = useState<string>(
    (content.text as string) || DEFAULT_NAVBAR_DATA.text
  );
  const [logoHeight, setLogoHeight] = useState<number>(
    typeof content.logoHeight === "number"
      ? content.logoHeight
      : DEFAULT_NAVBAR_DATA.logoHeight
  );
  const [href, setHref] = useState<string>(
    (content.href as string) || DEFAULT_NAVBAR_DATA.href
  );

  const [isSaving, setIsSaving] = useState(false);

  const applyPreset = (preset: typeof LOGO_PRESETS[number]) => {
    setMode(preset.mode);
    setLogoSrc(preset.logoSrc);
    setLogoHeight(preset.logoHeight);
    setText(preset.text);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave: NavbarSectionData = {
        mode,
        logoSrc,
        logoAlt,
        text,
        logoHeight,
        href,
      };
      await onSave(dataToSave as unknown as Record<string, unknown>);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      {/* 1. Живой предпросмотр в контексте шапки сайта */}
      <div className="bg-[#181820] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-pink flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
            Живой предпросмотр в шапке сайта
          </span>
          <span className="text-xs text-gray-400">
            Фон навигации: <code className="text-amber-300">#F3EFE8</code>
          </span>
        </div>

        <div className="w-full bg-[#F3EFE8] rounded-xl px-6 py-4 flex items-center justify-between shadow-inner">
          {/* Логотип в превью */}
          <div className="flex items-center gap-2 select-none py-1">
            {mode === "image" && logoSrc && (
              <img
                src={logoSrc}
                alt={logoAlt}
                style={{ height: `${logoHeight}px`, width: "auto" }}
                className="max-h-16 w-auto transition-all"
              />
            )}
            {mode === "split" && (
              <>
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt={logoAlt}
                    style={{ height: `${logoHeight}px`, width: "auto" }}
                    className="max-h-16 w-auto transition-all"
                  />
                )}
                <span className="font-bold text-xl sm:text-[24px] text-[#0A0A0A] tracking-tight leading-none">
                  {text || "Радиоточка"}
                </span>
              </>
            )}
            {mode === "text" && (
              <span className="font-bold text-xl sm:text-[24px] text-[#0A0A0A] tracking-tight leading-none">
                {text || "Радиоточка"}
              </span>
            )}
          </div>

          {/* Фейковые ссылки навигации для визуального баланса */}
          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-[#262626] opacity-70">
            <span>Услуги</span>
            <span>Радиостанции</span>
            <span>Кейсы</span>
            <span>О нас</span>
          </div>

          {/* Фейковая кнопка Связаться */}
          <div className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-brand-pink text-white font-semibold text-xs shadow-sm">
            Связаться ↗
          </div>
        </div>
      </div>

      {/* 2. Готовые варианты (Пресеты) */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-white uppercase tracking-wider">
          Готовые варианты логотипа (Кликните для выбора):
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LOGO_PRESETS.map((preset) => {
            const isSelected =
              logoSrc === preset.logoSrc && mode === preset.mode;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-brand-pink/10 border-brand-pink ring-2 ring-brand-pink/30 shadow-lg"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-white">
                    {preset.title}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      isSelected
                        ? "bg-brand-pink text-white"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>

                {/* Микро-превью логотипа */}
                <div className="bg-[#F3EFE8] rounded-lg p-2.5 flex items-center justify-start h-14 overflow-hidden">
                  {preset.mode === "split" ? (
                    <div className="flex items-center gap-1.5">
                      <img
                        src={preset.logoSrc}
                        alt="Превью"
                        className="h-7 w-auto"
                      />
                      <span className="font-bold text-sm text-black">
                        Радиоточка
                      </span>
                    </div>
                  ) : (
                    <img
                      src={preset.logoSrc}
                      alt="Превью"
                      className="h-8 w-auto"
                    />
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Режим отображения */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-200">
          Режим отображения в шапке:
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setMode("image")}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
              mode === "image"
                ? "bg-brand-pink text-white border-brand-pink"
                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
            }`}
          >
            Только логотип (SVG/PNG)
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
              mode === "split"
                ? "bg-brand-pink text-white border-brand-pink"
                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
            }`}
          >
            Иконка + отдельный текст
          </button>
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
              mode === "text"
                ? "bg-brand-pink text-white border-brand-pink"
                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
            }`}
          >
            Только текст
          </button>
        </div>
      </div>

      {/* 4. Загрузка полностью нового логотипа / кастомный файл */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-white uppercase tracking-wider">
            Загрузка своего логотипа (полностью новый файл)
          </label>
          <span className="text-xs text-gray-400">Поддерживаются SVG, PNG, WebP</span>
        </div>

        <ImageField
          label="Файл логотипа"
          value={logoSrc}
          onChange={setLogoSrc}
          hint="Перетащите сюда новый SVG или изображение с компьютера. SVG загружаются без потери качества."
        />
      </div>

      {/* 5. Настройки высоты и текста */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        {/* Высота логотипа */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-200">
              Высота логотипа в шапке:
            </label>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-pink/20 text-brand-pink">
              {logoHeight}px
            </span>
          </div>
          <input
            type="range"
            min={24}
            max={64}
            step={2}
            value={logoHeight}
            onChange={(e) => setLogoHeight(Number(e.target.value))}
            className="w-full accent-brand-pink cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>24px (компактно)</span>
            <span>40px (стандарт)</span>
            <span>64px (максимум)</span>
          </div>
        </div>

        {/* Текст названия (для split и text режимов) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-200">
            Текст названия (для режимов с текстом):
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Радиоточка"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink"
          />
        </div>

        {/* Alt-текст логотипа */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-200">
            Alt-текст (SEO и доступность):
          </label>
          <input
            type="text"
            value={logoAlt}
            onChange={(e) => setLogoAlt(e.target.value)}
            placeholder="Радиоточка — Рекламное агентство"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink"
          />
        </div>

        {/* Ссылка при клике */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-200">
            Ссылка при клике на логотип:
          </label>
          <input
            type="text"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="/"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink"
          />
        </div>
      </div>

      {/* 6. Кнопки сохранения */}
      <EditorFormFooter onCancel={onCancel} isLoading={isSaving} />
    </form>
  );
}
