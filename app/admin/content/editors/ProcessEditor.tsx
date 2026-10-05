"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import { ImageField } from "./ImageField";
import {
  DEFAULT_PROCESS_DATA,
  type ProcessStepItem,
  type ProcessSectionData,
} from "@/types/site-content";

const PRESET_PROCESS_IMAGES = [
  { label: "Этап 1 (Исследование)", src: "/images/process/step-01.jpg" },
  { label: "Этап 2 (Медиаплан)", src: "/images/process/step-02.jpg" },
  { label: "Этап 3 (Продакшн)", src: "/images/process/step-03.jpg" },
  { label: "Этап 4 (Аналитика)", src: "/images/process/step-04.jpg" },
];

export function ProcessEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<ProcessSectionData>;

  const [title, setTitle] = useState(content.title || DEFAULT_PROCESS_DATA.title || "Как мы работаем");
  const [items, setItems] = useState<ProcessStepItem[]>(
    content.items && content.items.length > 0
      ? content.items
      : DEFAULT_PROCESS_DATA.items
  );

  const [isLoading, setIsLoading] = useState(false);

  const updateItem = <K extends keyof ProcessStepItem>(
    index: number,
    field: K,
    val: ProcessStepItem[K]
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const handleAddItem = () => {
    const nextNum = String(items.length + 1).padStart(2, "0");
    setItems((prev) => [
      ...prev,
      {
        number: nextNum,
        title: "Новый этап",
        description: "Описание действий команды на этом этапе...",
        imageSrc: "/images/process/step-01.jpg",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetToDefault = () => {
    if (confirm("Сбросить этапы к значениям по умолчанию?")) {
      setTitle(DEFAULT_PROCESS_DATA.title || "Как мы работаем");
      setItems(DEFAULT_PROCESS_DATA.items);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({
      title,
      items,
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Заголовок секции */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Заголовок секции процесса
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl text-sm"
          placeholder="Как мы работаем"
        />
      </div>

      {/* Карточки этапов */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900">
            Карточки этапов процесса ({items.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
          >
            + Добавить этап
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-bold text-gray-800 text-base">
                  Этап #{idx + 1} ({item.number})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Удалить
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Номер (01, 02)
                  </label>
                  <input
                    type="text"
                    value={item.number}
                    onChange={(e) => updateItem(idx, "number", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                    placeholder="01"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Название этапа
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-semibold"
                    placeholder="Исследование"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Описание этапа
                </label>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm leading-relaxed"
                  placeholder="Анализируем аудиторию..."
                />
              </div>

              <ImageField
                label="Фоновое изображение этапа"
                value={item.imageSrc}
                onChange={(val) => updateItem(idx, "imageSrc", val)}
                presetImages={PRESET_PROCESS_IMAGES}
                hint="Рекомендуется вертикальное фото (3:4 или 9:16)."
              />
            </div>
          ))}
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
