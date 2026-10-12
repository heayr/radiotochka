"use client";

import React, { useRef, useState, useCallback } from "react";
import SafeImage, { normalizeImageUrl } from "@/app/components/ui/SafeImage";
import Button from "@/app/components/ui/Button";
import { ImageEditorModal } from "./ImageEditorModal";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  presetImages?: { label: string; src: string }[];
  hint?: string;
}

export function ImageField({
  label,
  value,
  onChange,
  presetImages,
  hint,
}: ImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      setIsProcessing(true);
      const reader = new FileReader();

      // Если это SVG — сохраняем чистый вектор DataURL напрямую без растеризации в Canvas
      if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          onChange(dataUrl);
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (!dataUrl) {
          setIsProcessing(false);
          return;
        }

        // Оптимизация изображения через Canvas (макс 1600px, WebP 85%)
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL("image/webp", 0.85);
            onChange(optimizedDataUrl);
          } else {
            onChange(dataUrl);
          }
          setIsProcessing(false);
        };

        img.onerror = () => {
          onChange(dataUrl);
          setIsProcessing(false);
        };

        img.src = dataUrl;
      };

      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const isDataUrl = value?.startsWith("data:");
  const displaySource = isDataUrl
    ? "Загружено с устройства (Data URL)"
    : value
    ? value.length > 55
      ? `${value.slice(0, 52)}...`
      : value
    : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
          {label}
        </label>
        {value && !showUrlInput && (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors"
          >
            Редактировать ссылку URL
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        className="hidden"
        onChange={handleFileChange}
      />

      {!value ? (
        /* Состояние: Изображение не выбрано (минималистичный дропзон) */
        <div className="space-y-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
              isDragOver
                ? "border-[#ea5670] bg-[#ea5670]/5"
                : "border-gray-200 hover:border-gray-300 bg-gray-50/60 hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#ea5670] group-hover:scale-105 transition-all">
                {isProcessing ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700">
                  {isProcessing
                    ? "Оптимизация изображения..."
                    : "Нажмите или перетащите изображение"}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  SVG, PNG, WebP или JPG
                </p>
              </div>
            </div>
          </div>

          {!showUrlInput ? (
            <div className="flex items-center justify-between text-xs px-1">
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                🔗 Вставить прямую ссылку / Google Диск
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(normalizeImageUrl(e.target.value))}
                placeholder="/images/... или https://... или Google Диск"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40"
              />
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1"
              >
                Скрыть
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Состояние: Изображение загружено (аккуратная карточка с компактными кнопками) */
        <div className="rounded-2xl border border-gray-200 bg-white p-3 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-3.5">
            {/* Превью с шашечками прозрачности */}
            <div className="relative w-24 h-16 rounded-xl border border-gray-200/80 overflow-hidden bg-[linear-gradient(45deg,#f4f4f5_25%,transparent_25%),linear-gradient(-45deg,#f4f4f5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f4f4f5_75%),linear-gradient(-45deg,transparent_75%,#f4f4f5_75%)] bg-[size:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0] flex-shrink-0 flex items-center justify-center p-1">
              <SafeImage
                src={value}
                alt="Превью"
                fill
                className="object-contain object-center"
              />
            </div>

            {/* Источник и быстрые действия */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-medium text-gray-700 truncate" title={value}>
                  {displaySource}
                </span>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Удалить изображение"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Компактный ряд кнопок управления */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditorOpen(true)}
                  className="!px-2.5 !py-1 !text-xs font-medium"
                >
                  ✂️ Обрезать / Редактор
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="!px-2.5 !py-1 !text-xs"
                >
                  {isProcessing ? "Загрузка..." : "🔄 Заменить"}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 transition-colors"
                >
                  {showUrlInput ? "Скрыть URL" : "🔗 URL"}
                </button>
              </div>
            </div>
          </div>

          {showUrlInput && (
            <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(normalizeImageUrl(e.target.value))}
                placeholder="/images/... или https://... или Google Диск"
                className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40"
              />
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="text-xs text-gray-400 hover:text-gray-700 px-2"
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      )}

      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}

      {presetImages && presetImages.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mr-1">
            Пресеты:
          </span>
          {presetImages.map((preset) => (
            <button
              key={preset.src}
              type="button"
              onClick={() => onChange(preset.src)}
              className={`text-xs px-2.5 py-0.5 rounded-lg border transition-all ${
                value === preset.src
                  ? "bg-[#ea5670]/10 border-[#ea5670] text-[#ea5670] font-semibold"
                  : "bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      <ImageEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        imageUrl={value}
        onSave={(newUrl) => onChange(newUrl)}
      />
    </div>
  );
}
