"use client";

import { useState } from "react";
import Button from "@/app/components/Button";
import { ImageField } from "./ImageField";
import { defaultLogos } from "@/app/components/sections/LogoSection";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import {
  DEFAULT_LOGO_SECTION_DATA,
  type LogoItem,
} from "@/types/site-content";

const PRESET_LOGOS = [
  { label: "Дорожное Радио", src: "/images/dorozhnoe.svg" },
  { label: "Наше Радио", src: "/images/nashe.svg" },
  { label: "Радиоточка", src: "/images/main-logo.svg" },
];

export function LogoSectionEditor({ block, onSave, onCancel }: EditorProps) {
  const content = block.content as Record<string, unknown>;

  const [title, setTitle] = useState(
    (content.title as string) || DEFAULT_LOGO_SECTION_DATA.title || "Наши клиенты",
  );
  const [subtitle, setSubtitle] = useState(
    (content.subtitle as string) ||
      DEFAULT_LOGO_SECTION_DATA.subtitle ||
      "Работали с более чем 100+ брендами в регионе",
  );
  const [subtext, setSubtext] = useState(
    (content.subtext as string) ||
      DEFAULT_LOGO_SECTION_DATA.subtext ||
      "Ритейл · Авто · Недвижимость · Сфера услуг · Медицина",
  );

  const initialLogos: LogoItem[] = Array.isArray(content.logos) && content.logos.length > 0
    ? (content.logos as LogoItem[])
    : DEFAULT_LOGO_SECTION_DATA.logos;

  const [logos, setLogos] = useState<LogoItem[]>(initialLogos);
  const [isLoading, setIsLoading] = useState(false);

  const updateLogoSrc = (idx: number, newSrc: string) => {
    setLogos((prev) =>
      prev.map((logo, i) =>
        i === idx
          ? {
              ...logo,
              src: newSrc,
              // Если загружено изображение или ссылка — тип явно становится "image"
              type: newSrc.trim() ? "image" : logo.type,
            }
          : logo,
      ),
    );
  };

  const updateLogoField = <K extends keyof LogoItem>(
    idx: number,
    field: K,
    val: LogoItem[K]
  ) => {
    setLogos((prev) =>
      prev.map((logo, i) => (i === idx ? { ...logo, [field]: val } : logo))
    );
  };

  const updateLogoAlt = (idx: number, newAlt: string) => {
    setLogos((prev) =>
      prev.map((logo, i) =>
        i === idx ? { ...logo, alt: newAlt, name: newAlt } : logo,
      ),
    );
  };

  const addLogo = () => {
    setLogos((prev) => [
      ...prev,
      { src: "", alt: `Клиент ${prev.length + 1}`, name: `Клиент ${prev.length + 1}`, type: "image" },
    ]);
  };

  const removeLogo = (idx: number) => {
    setLogos((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveLogo = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= logos.length) return;

    setLogos((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  const resetLogo = (idx: number) => {
    const fallback = defaultLogos[idx] || { src: "", alt: `Клиент ${idx + 1}` };
    setLogos((prev) =>
      prev.map((logo, i) => (i === idx ? { ...fallback } : logo)),
    );
  };

  const resetToDefault = () => {
    if (confirm("Сбросить все логотипы к исходному набору из шаблона?")) {
      setLogos(
        defaultLogos.map((l) => ({
          src: l.src,
          alt: l.alt,
          name: l.name,
          type: l.type,
        })),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({
      title,
      subtitle,
      subtext,
      logos,
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Заголовки секции */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-4">
        <h4 className="font-semibold text-gray-800 text-sm">
          Настройки заголовка секции
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Главный заголовок
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-xl text-sm font-semibold"
              placeholder="Наши клиенты"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Подзаголовок
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-xl text-sm"
              placeholder="Работали с более чем 100+ брендами в регионе"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Отрасли / Категории
            </label>
            <input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="w-full px-3.5 py-2 border rounded-xl text-sm"
              placeholder="Ритейл · Авто · Недвижимость · Сфера услуг"
            />
          </div>
        </div>
      </div>

      {/* Список логотипов клиентов */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 text-sm">
            Логотипы брендов и клиентов ({logos.length})
          </h4>
          <span className="text-xs text-gray-500">
            Поддерживаются файлы с ПК (PNG, SVG, WebP, JPG) и внешние ссылки
          </span>
        </div>

        <div className="space-y-3">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500">
                  Логотип #{idx + 1}: {logo.alt || logo.name || "Без названия"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveLogo(idx, "up")}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    title="Переместить выше"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={idx === logos.length - 1}
                    onClick={() => moveLogo(idx, "down")}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    title="Переместить ниже"
                  >
                    ↓
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => resetLogo(idx)}
                    className="!text-xs !py-1 text-gray-500"
                  >
                    Сбросить
                  </Button>
                  <button
                    type="button"
                    onClick={() => removeLogo(idx)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors text-xs font-medium ml-2"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {/* Поле загрузки изображения с ПК или указания ссылки */}
              <ImageField
                label="Изображение логотипа (ссылка или файл с ПК)"
                value={logo.src}
                onChange={(newSrc) => updateLogoSrc(idx, newSrc)}
                presetImages={PRESET_LOGOS}
                hint="Форматы: SVG (рекомендуется), WebP, PNG с прозрачным фоном. Высота ~50-60px."
              />

              {/* Название бренда / Alt-текст и Ссылка на сайт */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Название бренда / Alt-текст
                  </label>
                  <input
                    type="text"
                    value={logo.alt || logo.name || ""}
                    onChange={(e) => updateLogoAlt(idx, e.target.value)}
                    placeholder="Например: Дорожное Радио, Сбербанк"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    🔗 Ссылка на сайт клиента (URL)
                  </label>
                  <input
                    type="url"
                    value={logo.href || ""}
                    onChange={(e) => updateLogoField(idx, "href", e.target.value)}
                    placeholder="https://company.ru"
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40"
                  />
                </div>
              </div>

              {/* Настройки размера, масштаба и стиля отображения */}
              <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span>Настройки отображения в секции</span>
                  <span className="text-[11px] font-normal text-gray-500">
                    Масштаб: {logo.scale ?? 100}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  {/* Слайдер масштаба */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-gray-600">
                      <span>Размер логотипа</span>
                      <button
                        type="button"
                        onClick={() => updateLogoField(idx, "scale", 100)}
                        className="text-[10px] text-[#ea5670] hover:underline"
                      >
                        Сброс 100%
                      </button>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="180"
                      step="5"
                      value={logo.scale ?? 100}
                      onChange={(e) =>
                        updateLogoField(idx, "scale", parseInt(e.target.value, 10))
                      }
                      className="w-full accent-[#ea5670]"
                    />
                  </div>

                  {/* Цветовой стиль */}
                  <div className="space-y-1">
                    <span className="block text-[11px] text-gray-600">
                      Цветовой стиль
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(
                        [
                          { id: "none", label: "Цветной" },
                          { id: "grayscale", label: "Монохром" },
                          { id: "invert", label: "Инверсия" },
                        ] as const
                      ).map((filterOption) => (
                        <button
                          key={filterOption.id}
                          type="button"
                          onClick={() =>
                            updateLogoField(idx, "filter", filterOption.id)
                          }
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                            (logo.filter || "none") === filterOption.id
                              ? "bg-[#ea5670]/10 border-[#ea5670] text-[#ea5670]"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {filterOption.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки добавления и сброса */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button type="button" variant="primary" size="sm" onClick={addLogo}>
          + Добавить логотип клиента
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetToDefault}
        >
          Сбросить все логотипы к дефолту
        </Button>
      </div>

      <EditorFormFooter isLoading={isLoading} onCancel={onCancel} />
    </form>
  );
}

