"use client";

import React, { useRef, useState } from "react";
import SafeImage from "@/app/components/SafeImage";
import Button from "@/app/components/Button";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

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
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Превью изображения */}
        <div className="relative w-24 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center shadow-sm">
          {value ? (
            <SafeImage
              src={value}
              alt="Превью"
              fill
              className="object-cover object-center"
            />
          ) : (
            <span className="text-[11px] text-gray-400">Нет фото</span>
          )}
        </div>

        {/* Поле ввода пути или URL */}
        <div className="flex-1 w-full space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... или https://... или загрузите файл"
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ea5670]/40 focus:border-[#ea5670] transition-all"
          />

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
            >
              {isProcessing ? "Оптимизация..." : "📁 Загрузить с устройства"}
            </Button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Очистить
              </button>
            )}
          </div>
        </div>
      </div>

      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      {presetImages && presetImages.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mr-1">
            Быстрый выбор:
          </span>
          {presetImages.map((preset) => (
            <button
              key={preset.src}
              type="button"
              onClick={() => onChange(preset.src)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                value === preset.src
                  ? "bg-[#ea5670]/10 border-[#ea5670] text-[#ea5670] font-semibold"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
