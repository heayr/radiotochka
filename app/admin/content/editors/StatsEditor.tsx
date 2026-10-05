"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import { ImageField } from "./ImageField";
import {
  DEFAULT_STATS_DATA,
  type StatMetricItem,
  type ServicePillItem,
  type StatsSectionData,
} from "@/types/site-content";

const PRESET_BANNER_IMAGES = [
  { label: "Студия десктоп", src: "/images/stats-banner-desktop.jpg" },
  { label: "Студия мобайл", src: "/images/stats-banner-mobile.jpg" },
];

export function StatsEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<StatsSectionData>;

  const [metrics, setMetrics] = useState<StatMetricItem[]>(
    content.metrics && content.metrics.length > 0
      ? content.metrics
      : DEFAULT_STATS_DATA.metrics
  );
  const [pills, setPills] = useState<ServicePillItem[]>(
    content.pills && content.pills.length > 0
      ? content.pills
      : DEFAULT_STATS_DATA.pills
  );
  const [desktopBanner, setDesktopBanner] = useState(
    content.desktopBanner || DEFAULT_STATS_DATA.desktopBanner
  );
  const [mobileBanner, setMobileBanner] = useState(
    content.mobileBanner || DEFAULT_STATS_DATA.mobileBanner
  );

  const [isLoading, setIsLoading] = useState(false);

  const updateMetric = (idx: number, field: keyof StatMetricItem, val: string) => {
    setMetrics((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: val } : m))
    );
  };

  const updatePill = (idx: number, field: keyof ServicePillItem, val: string) => {
    setPills((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: val } : p))
    );
  };

  const handleResetToDefault = () => {
    if (confirm("Сбросить показатели и баннеры к значениям по умолчанию?")) {
      setMetrics(DEFAULT_STATS_DATA.metrics);
      setPills(DEFAULT_STATS_DATA.pills);
      setDesktopBanner(DEFAULT_STATS_DATA.desktopBanner);
      setMobileBanner(DEFAULT_STATS_DATA.mobileBanner);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({
      metrics,
      pills,
      desktopBanner,
      mobileBanner,
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 3 Главные метрики */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-900">
          Цифры и метрики агентства ({metrics.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Показатель #{idx + 1}
              </span>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Значение цифры (20+, 80 000+, 100%)
                </label>
                <input
                  type="text"
                  value={m.value}
                  onChange={(e) => updateMetric(idx, "value", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-lg font-extrabold text-[#ea5670]"
                  placeholder="20+"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Подпись к цифре
                </label>
                <textarea
                  rows={2}
                  value={m.label}
                  onChange={(e) => updateMetric(idx, "label", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs leading-relaxed"
                  placeholder="Лет успешной работы в Балаково"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Плашки услуг (Pills) */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-lg font-bold text-gray-900">
          Быстрые плашки услуг в шапке баннера ({pills.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pills.map((pill, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-2"
            >
              <label className="block text-xs font-semibold text-gray-600">
                Плашка #{idx + 1}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pill.label}
                  onChange={(e) => updatePill(idx, "label", e.target.value)}
                  className="w-2/3 px-3 py-1.5 border rounded-lg text-sm bg-white"
                  placeholder="Текст плашки"
                />
                <input
                  type="text"
                  value={pill.href}
                  onChange={(e) => updatePill(idx, "href", e.target.value)}
                  className="w-1/3 px-3 py-1.5 border rounded-lg text-xs bg-white"
                  placeholder="#services"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Фото-баннеры студии */}
      <div className="space-y-6 pt-4 border-t">
        <h4 className="text-lg font-bold text-gray-900">
          Фоновые фотографии студии (Баннеры)
        </h4>

        <ImageField
          label="Десктопное фото студии (горизонтальное 16:9)"
          value={desktopBanner}
          onChange={setDesktopBanner}
          presetImages={PRESET_BANNER_IMAGES}
          hint="Отображается на ноутбуках и мониторах."
        />

        <ImageField
          label="Мобильное фото студии (вертикальное 9:16)"
          value={mobileBanner}
          onChange={setMobileBanner}
          presetImages={PRESET_BANNER_IMAGES}
          hint="Отображается на смартфонах."
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResetToDefault}
        >
          Вернуть по умолчанию
        </Button>

        <EditorFormFooter isLoading={isLoading} onCancel={onCancel} />
      </div>
    </form>
  );
}
