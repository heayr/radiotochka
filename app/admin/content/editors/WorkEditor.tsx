"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import { ImageField } from "./ImageField";
import {
  DEFAULT_WORK_DATA,
  type WorkProjectItem,
  type WorkSectionData,
} from "@/types/site-content";

const PRESET_WORK_IMAGES = [
  { label: "Проект 1", src: "/images/work/project-01.png" },
  { label: "Проект 2", src: "/images/work/project-02.png" },
  { label: "Проект 3", src: "/images/work/project-03.png" },
  { label: "Проект 4", src: "/images/work/project-04.png" },
];

export function WorkEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<WorkSectionData>;

  const [title, setTitle] = useState(content.title || DEFAULT_WORK_DATA.title || "Избранные проекты");
  const [subtitle, setSubtitle] = useState(content.subtitle || DEFAULT_WORK_DATA.subtitle || "Кейсы агентства");
  const [items, setItems] = useState<WorkProjectItem[]>(
    content.items && content.items.length > 0
      ? content.items
      : DEFAULT_WORK_DATA.items
  );

  const [isLoading, setIsLoading] = useState(false);

  const updateItem = <K extends keyof WorkProjectItem>(
    index: number,
    field: K,
    val: WorkProjectItem[K]
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const updateServices = (index: number, servicesText: string) => {
    const list = servicesText.split(",").map((s) => s.trim()).filter(Boolean);
    updateItem(index, "services", list);
  };

  const handleAddItem = () => {
    const nextNum = String(items.length + 1).padStart(2, "0");
    setItems((prev) => [
      ...prev,
      {
        id: nextNum,
        title: "Новый проект",
        description: "Описание рекламной кампании, задач и достигнутых результатов...",
        client: "Имя клиента",
        services: ["Айдентика", "Радиоэфир"],
        imageSrc: "/images/work/project-01.png",
        href: "#contact",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetToDefault = () => {
    if (confirm("Сбросить карточки проектов к дефолтным значениям?")) {
      setTitle(DEFAULT_WORK_DATA.title || "Избранные проекты");
      setSubtitle(DEFAULT_WORK_DATA.subtitle || "Кейсы агентства");
      setItems(DEFAULT_WORK_DATA.items);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({
      title,
      subtitle,
      items,
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Заголовки секции */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Заголовок секции проектов
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl text-sm"
            placeholder="Избранные проекты"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Подзаголовок / Категория
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl text-sm"
            placeholder="Кейсы агентства"
          />
        </div>
      </div>

      {/* Карточки проектов */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900">
            Карточки проектов ({items.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
          >
            + Добавить проект
          </Button>
        </div>

        <div className="space-y-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-bold text-gray-800 text-base">
                  Проект #{idx + 1}: {item.title || "Без названия"}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Удалить проект
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Название проекта
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-semibold"
                    placeholder="Alongside"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Клиент
                  </label>
                  <input
                    type="text"
                    value={item.client}
                    onChange={(e) => updateItem(idx, "client", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    placeholder="Lumina Legal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Описание кейса
                </label>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm leading-relaxed"
                  placeholder="Комплексный ребрендинг..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Услуги (через запятую)
                  </label>
                  <input
                    type="text"
                    value={item.services.join(", ")}
                    onChange={(e) => updateServices(idx, e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    placeholder="Айдентика, Радиоэфир"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Ссылка на кейс или кнопку
                  </label>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateItem(idx, "href", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    placeholder="#contact или /cases/..."
                  />
                </div>
              </div>

              <ImageField
                label="Изображение кейса"
                value={item.imageSrc}
                onChange={(val) => updateItem(idx, "imageSrc", val)}
                presetImages={PRESET_WORK_IMAGES}
                hint="Рекомендуется изображение 16:10 или 4:3 для горизонтальных карточек."
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
