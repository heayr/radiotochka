"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import {
  DEFAULT_MANIFESTO_DATA,
  type ManifestoSectionData,
} from "@/types/site-content";

export function ManifestoEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<ManifestoSectionData>;

  const [text, setText] = useState(content.text || DEFAULT_MANIFESTO_DATA.text);
  const [since, setSince] = useState(content.since || DEFAULT_MANIFESTO_DATA.since);
  const [citiesText, setCitiesText] = useState(
    (content.cities || DEFAULT_MANIFESTO_DATA.cities).join(", ")
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleResetToDefault = () => {
    if (confirm("Сбросить манифест к значениям по умолчанию?")) {
      setText(DEFAULT_MANIFESTO_DATA.text);
      setSince(DEFAULT_MANIFESTO_DATA.since);
      setCitiesText(DEFAULT_MANIFESTO_DATA.cities.join(", "));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cities = citiesText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    await onSave({
      text,
      since,
      cities,
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            Текст манифеста агентства (с пословной кинематографичной анимацией при скролле)
          </label>
          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base leading-relaxed focus:ring-2 focus:ring-[#ea5670]/40 focus:border-[#ea5670]"
            placeholder="Мы не делаем рекламу..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Год основания / Метка слева
            </label>
            <input
              type="text"
              value={since}
              onChange={(e) => setSince(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
              placeholder="SINCE 2004"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Города вещания (через запятую)
            </label>
            <input
              type="text"
              value={citiesText}
              onChange={(e) => setCitiesText(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
              placeholder="БАЛАКОВО, САРАТОВ, ВОЛЬСК"
            />
          </div>
        </div>
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
