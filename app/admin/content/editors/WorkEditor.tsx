"use client";

import React, { useState } from "react";
import Button from "@/app/components/ui/Button";
import { EditorFormFooter } from "./EditorFormFooter";
import type { EditorProps } from "./editor-types";
import { ImageField } from "./ImageField";
import {
  DEFAULT_WORK_DATA,
  type WorkProjectItem,
  type WorkSectionData,
} from "@/types/site-content";

const PRESET_WORK_IMAGES = [
  { label: "Дэдпул на лоурайдере (Трубопласт)", src: "/images/work/deadpool-truboplast.jpg" },
  { label: "Проект 1", src: "/images/work/project-01.png" },
  { label: "Проект 2", src: "/images/work/project-02.png" },
  { label: "Проект 3", src: "/images/work/project-03.png" },
  { label: "Проект 4", src: "/images/work/project-04.png" },
];

const DUMMY_TITLES = new Set(["alongside", "hypertech", "redefine flow", "recap"]);
const DUMMY_CLIENTS = new Set(["lumina legal", "fitfuel nutrition", "verge consulting", "harbor financial"]);

function isDummySample(item: WorkProjectItem) {
  const t = (item.title || "").toLowerCase().trim();
  const c = (item.client || "").toLowerCase().trim();
  return DUMMY_TITLES.has(t) || DUMMY_CLIENTS.has(c);
}

export function WorkEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<WorkSectionData>;

  const [title, setTitle] = useState(content.title || DEFAULT_WORK_DATA.title || "Избранные проекты");
  const [subtitle, setSubtitle] = useState(content.subtitle || DEFAULT_WORK_DATA.subtitle || "Кейсы агентства");

  // Автоматически очищаем устаревшие демонстрационные шаблоны, оставляя реальные проекты студии
  const rawContentItems = content.items && Array.isArray(content.items) ? content.items : [];
  const cleanItems = rawContentItems.filter((item) => !isDummySample(item));
  const hasAudio = cleanItems.some((item) => item.projectType === "audio" || Boolean(item.audioSrc));

  const initialItems: WorkProjectItem[] =
    cleanItems.length > 0 && hasAudio
      ? cleanItems
      : cleanItems.length > 0
      ? [...cleanItems, ...DEFAULT_WORK_DATA.items]
      : DEFAULT_WORK_DATA.items;

  const [items, setItems] = useState<WorkProjectItem[]>(initialItems);

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

              {/* Ссылка на сайт клиента: кнопка «Сайт клиента» отображается в карточке только при наличии ссылки */}
              <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">
                      Ссылка на сайт клиента
                    </span>
                    {item.clientUrl ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Кнопка включена в кейсе
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-full">
                        Кнопка скрыта (ссылка не указана)
                      </span>
                    )}
                  </div>

                  {item.clientUrl && (
                    <button
                      type="button"
                      onClick={() => updateItem(idx, "clientUrl", "")}
                      className="text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer"
                    >
                      Убрать ссылку и скрыть кнопку
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={item.clientUrl || ""}
                    onChange={(e) => updateItem(idx, "clientUrl", e.target.value)}
                    className="w-full px-3 py-2 border bg-white rounded-xl text-sm pr-9 focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
                    placeholder="https://example.com (вставьте URL, чтобы отобразить кнопку перехода на сайт клиента)"
                  />
                  {item.clientUrl && (
                    <a
                      href={item.clientUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                      title="Проверить ссылку в новой вкладке"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  По дефолту кнопки и заглушки нет. Когда ссылка добавлена, в строке клиента появится аккуратная кнопка «Сайт клиента ↗».
                </p>
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

              {/* Выбор типа проекта: Визуальный или Аудио */}
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-gray-700 uppercase">Шаблон карточки:</span>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name={`projectType-${idx}`}
                    value="visual"
                    checked={item.projectType !== "audio" && !item.audioSrc}
                    onChange={() => {
                      updateItem(idx, "projectType", "visual");
                      updateItem(idx, "audioSrc", "");
                    }}
                  />
                  <span>Стандартный кейс (фото)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name={`projectType-${idx}`}
                    value="audio"
                    checked={item.projectType === "audio" || Boolean(item.audioSrc)}
                    onChange={() => {
                      updateItem(idx, "projectType", "audio");
                      if (!item.audioSrc) {
                        updateItem(idx, "audioSrc", "/sounds/truboplast-deadpool-glanz.mp3");
                      }
                    }}
                  />
                  <span className="text-red-600 font-bold">Аудио-проект (радиоэфир / диктор)</span>
                </label>
              </div>

              {/* Специфичные поля аудио-шаблона */}
              {(item.projectType === "audio" || Boolean(item.audioSrc)) && (
                <div className="bg-red-50/50 border border-red-200 p-4 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-red-800 uppercase tracking-wider">
                      Параметры аудиоролика и эфира
                    </span>
                    <span className="text-[11px] text-red-600 font-medium">
                      В карточке отобразится интерактивный аудиоплеер
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Актёр / Звёздный диктор
                      </label>
                      <input
                        type="text"
                        value={item.celebrityVoice || ""}
                        onChange={(e) => updateItem(idx, "celebrityVoice", e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                        placeholder="Пётр Иващенко (Пётр Гланц)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Бейдж диктора
                      </label>
                      <input
                        type="text"
                        value={item.celebrityBadge || ""}
                        onChange={(e) => updateItem(idx, "celebrityBadge", e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                        placeholder="Официальный голос Дэдпула в РФ"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Цитата / Слоган из ролика
                    </label>
                    <input
                      type="text"
                      value={item.tagline || ""}
                      onChange={(e) => updateItem(idx, "tagline", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm italic"
                      placeholder="«Трубы, фитинги, монтаж... Работаем с НДС!»"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Радиоэфир / Станции
                      </label>
                      <input
                        type="text"
                        value={item.radioStation || ""}
                        onChange={(e) => updateItem(idx, "radioStation", e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                        placeholder="Дорожное Радио · НАШЕ Радио"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Хронометраж и формат
                      </label>
                      <input
                        type="text"
                        value={item.audioFormat || ""}
                        onChange={(e) => updateItem(idx, "audioFormat", e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-sm"
                        placeholder="Эфирный ролик · 25 сек"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      URL аудиофайла (.mp3)
                    </label>
                    <input
                      type="text"
                      value={item.audioSrc || ""}
                      onChange={(e) => updateItem(idx, "audioSrc", e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-mono text-xs"
                      placeholder="/sounds/truboplast-deadpool-glanz.mp3"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[11px] text-gray-500 self-center mr-1">Пресеты звука:</span>
                      <button
                        type="button"
                        onClick={() => {
                          updateItem(idx, "audioSrc", "/sounds/truboplast-deadpool-glanz.mp3");
                          updateItem(idx, "celebrityVoice", "Пётр Иващенко (Пётр Гланц)");
                          updateItem(idx, "celebrityBadge", "Официальный голос Дэдпула в РФ");
                        }}
                        className="text-[11px] px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md font-medium"
                      >
                        Дэдпул (Пётр Гланц)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateItem(idx, "audioSrc", "/sounds/dary-armenii-sergey-chonishvili.mp3");
                          updateItem(idx, "celebrityVoice", "Сергей Чонишвили");
                          updateItem(idx, "celebrityBadge", "Заслуженный артист РФ · Голос СТС");
                        }}
                        className="text-[11px] px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md font-medium"
                      >
                        Сергей Чонишвили
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateItem(idx, "audioSrc", "/sounds/akvadom-hiphop-kuraj-bambey.mp3");
                          updateItem(idx, "celebrityVoice", "Денис Колесников");
                          updateItem(idx, "celebrityBadge", "Культовый голос · Кураж-Бамбей");
                        }}
                        className="text-[11px] px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md font-medium"
                      >
                        Кураж-Бамбей
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
