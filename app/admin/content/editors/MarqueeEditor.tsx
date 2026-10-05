"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import {
  DEFAULT_MARQUEE_DATA,
  type MarqueeSectionData,
} from "@/types/site-content";

export function MarqueeEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<MarqueeSectionData>;

  const [phrases, setPhrases] = useState<string[]>(
    content.phrases && content.phrases.length > 0
      ? content.phrases
      : DEFAULT_MARQUEE_DATA.phrases
  );
  const [newPhrase, setNewPhrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPhrase = () => {
    if (!newPhrase.trim()) return;
    setPhrases((prev) => [...prev, newPhrase.trim().toUpperCase()]);
    setNewPhrase("");
  };

  const handleRemovePhrase = (idx: number) => {
    setPhrases((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdatePhrase = (idx: number, val: string) => {
    setPhrases((prev) => prev.map((p, i) => (i === idx ? val.toUpperCase() : p)));
  };

  const handleResetToDefault = () => {
    if (confirm("Сбросить фразы бегущей строки к значениям по умолчанию?")) {
      setPhrases(DEFAULT_MARQUEE_DATA.phrases);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data: MarqueeSectionData = {
        phrases: phrases.filter((p) => p.trim().length > 0),
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
            ⚡ Бегущая строка (Marquee)
          </h4>
          <p className="text-xs text-gray-500">
            Бесконечная бегущая лента с ключевыми направлениями и станциями.
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

      <div className="space-y-3">
        <label className="block text-xs font-semibold text-gray-700">
          Фразы бегущей строки (разделитель «/» подставляется автоматически)
        </label>

        <div className="space-y-2">
          {phrases.map((phrase, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 w-6">
                #{idx + 1}
              </span>
              <input
                type="text"
                value={phrase}
                onChange={(e) => handleUpdatePhrase(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none uppercase font-semibold"
                required
              />
              <button
                type="button"
                onClick={() => handleRemovePhrase(idx)}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                title="Удалить фразу"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Добавление новой фразы */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddPhrase();
              }
            }}
            placeholder="Новая фраза (нажмите Enter)..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none uppercase"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPhrase}
          >
            + Добавить
          </Button>
        </div>
      </div>

      {/* Живое превью */}
      <div className="bg-[#F3EFE8] rounded-xl p-4 border border-[#E0D8CB] overflow-hidden">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
          Превью бегущей строки
        </span>
        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[#0A0A0A] overflow-x-auto py-2 whitespace-nowrap">
          {phrases.map((phrase, idx) => (
            <React.Fragment key={idx}>
              <span>{phrase}</span>
              <span className="text-[#ea5670] font-bold">/</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <EditorFormFooter
        isLoading={isLoading}
        onCancel={onCancel}
        saveLabel="Сохранить бегущую строку"
      />
    </form>
  );
}
