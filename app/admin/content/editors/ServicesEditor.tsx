"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import { ImageField } from "./ImageField";
import {
  DEFAULT_SERVICES_DATA,
  type ServiceCardItem,
  type ServiceBottomCard,
  type ServicesSectionData,
} from "@/types/site-content";

const PRESET_SERVICE_IMAGES = [
  { label: "Радио студия", src: "/images/services/service-01-radio-real.jpg" },
  { label: "Билборд", src: "/images/services/service-02-billboard.jpg" },
  { label: "Аудиопродакшн", src: "/images/services/service-03-studio.jpg" },
  { label: "Полиграфия", src: "/images/services/service-04-polygraphy.jpg" },
];

export function ServicesEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<ServicesSectionData>;

  const [title, setTitle] = useState(content.title || DEFAULT_SERVICES_DATA.title || "Наши услуги");
  const [items, setItems] = useState<ServiceCardItem[]>(
    content.items && content.items.length > 0
      ? content.items
      : DEFAULT_SERVICES_DATA.items
  );
  const [bottomCards, setBottomCards] = useState<ServiceBottomCard[]>(
    content.bottomCards && content.bottomCards.length > 0
      ? content.bottomCards
      : DEFAULT_SERVICES_DATA.bottomCards
  );

  const [isLoading, setIsLoading] = useState(false);

  // Обновление отдельной карточки услуги
  const updateItem = <K extends keyof ServiceCardItem>(
    index: number,
    field: K,
    val: ServiceCardItem[K]
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  // Теги услуги
  const updateTags = (index: number, tagsText: string) => {
    const split = tagsText.split("\n").filter((t) => t.trim().length > 0);
    updateItem(index, "tags", split);
  };

  // Добавление новой карточки услуги
  const handleAddItem = () => {
    const nextNum = String(items.length + 1).padStart(2, "0");
    setItems((prev) => [
      ...prev,
      {
        id: nextNum,
        category: "Новая категория",
        title: "Заголовок новой услуги",
        statNumber: "№1",
        statLabel: "показатель",
        description: "Подробное описание условий и возможностей услуги...",
        tags: ["Пункт 1", "Пункт 2", "Пункт 3"],
        image: "/images/services/service-01-radio-real.jpg",
        alt: "Иллюстрация услуги",
      },
    ]);
  };

  // Удаление карточки
  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Обновление нижней карточки
  const updateBottomCard = (
    index: number,
    field: keyof ServiceBottomCard,
    val: string
  ) => {
    setBottomCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: val } : c))
    );
  };

  // Сброс к дефолту
  const handleResetToDefault = () => {
    if (confirm("Сбросить все карточки услуг к изначальному дизайну?")) {
      setTitle(DEFAULT_SERVICES_DATA.title || "Наши услуги");
      setItems(DEFAULT_SERVICES_DATA.items);
      setBottomCards(DEFAULT_SERVICES_DATA.bottomCards);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave({
      title,
      items,
      bottomCards,
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Главный заголовок секции */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl">
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Заголовок секции услуг
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ea5670]/40 focus:border-[#ea5670]"
          placeholder="Наши услуги"
        />
      </div>

      {/* 3 Большие каскадные карточки (Stacking Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900">
            Основные карточки услуг ({items.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
          >
            + Добавить карточку
          </Button>
        </div>

        <div className="space-y-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#ea5670] text-white font-bold flex items-center justify-center text-sm">
                    {item.id || idx + 1}
                  </span>
                  <span className="font-bold text-gray-800 text-base">
                    Карточка #{idx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Удалить карточку
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Категория (надзаголовок)
                  </label>
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updateItem(idx, "category", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    placeholder="Радиоресурсы и прямой эфир"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Заголовок услуги
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-semibold"
                    placeholder="Реклама на «Дорожном радио»"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Главная цифра / Статус
                  </label>
                  <input
                    type="text"
                    value={item.statNumber}
                    onChange={(e) => updateItem(idx, "statNumber", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    placeholder="№1 в Балаково"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Подпись к цифре
                  </label>
                  <input
                    type="text"
                    value={item.statLabel}
                    onChange={(e) => updateItem(idx, "statLabel", e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                    placeholder="эксклюзивный представитель"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Подробное описание
                </label>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm leading-relaxed"
                  placeholder="Официальный представитель..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Теги преимуществ (каждый тег с новой строки)
                </label>
                <textarea
                  rows={3}
                  value={item.tags.join("\n")}
                  onChange={(e) => updateTags(idx, e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                  placeholder="Дорожное радио&#10;Прямой эфир&#10;Эксклюзивные условия"
                />
              </div>

              {/* Поле фотографии карточки */}
              <div className="pt-2">
                <ImageField
                  label="Фотография карточки"
                  value={item.image}
                  onChange={(val) => updateItem(idx, "image", val)}
                  presetImages={PRESET_SERVICE_IMAGES}
                  hint="Поддерживаются URL (https://...), локальные пути (/images/...) и прямая загрузка файла."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Alt-текст для фото
                </label>
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => updateItem(idx, "alt", e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  placeholder="Профессиональная студия прямого радиоэфира"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Нижние карточки преимуществ */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-lg font-bold text-gray-900">
          3 Нижние карточки преимуществ
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bottomCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#F8F5EE] border border-[#E5DFD5] p-4 rounded-xl space-y-2.5"
            >
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Нижняя карточка #{idx + 1}
              </span>
              <input
                type="text"
                value={card.title}
                onChange={(e) => updateBottomCard(idx, "title", e.target.value)}
                className="w-full px-3 py-1.5 border rounded-lg text-sm font-bold bg-white"
                placeholder="Заголовок"
              />
              <textarea
                rows={2}
                value={card.description}
                onChange={(e) =>
                  updateBottomCard(idx, "description", e.target.value)
                }
                className="w-full px-3 py-1.5 border rounded-lg text-xs leading-relaxed bg-white"
                placeholder="Описание"
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
          Вернуть дизайн по умолчанию
        </Button>

        <EditorFormFooter isLoading={isLoading} onCancel={onCancel} />
      </div>
    </form>
  );
}
