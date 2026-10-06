"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Button from "@/app/components/Button";

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (newImageUrl: string) => void;
}

export function ImageEditorModal({
  isOpen,
  onClose,
  imageUrl,
  onSave,
}: ImageEditorModalProps) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"free" | "3:1" | "2:1" | "1:1">("3:1");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Загрузка исходного изображения
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageObjRef.current = img;
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setRotation(0);
      renderCanvas();
    };
    img.src = imageUrl;
  }, [isOpen, imageUrl]);

  // Отрисовка на canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Определяем размеры холста
    let width = 600;
    let height = 200;
    if (aspectRatio === "3:1") {
      width = 600;
      height = 200;
    } else if (aspectRatio === "2:1") {
      width = 600;
      height = 300;
    } else if (aspectRatio === "1:1") {
      width = 400;
      height = 400;
    } else {
      // Free - по пропорциям картинки
      const ratio = img.width / (img.height || 1);
      width = 600;
      height = Math.round(width / ratio);
      if (height > 500) {
        height = 500;
        width = Math.round(height * ratio);
      }
    }

    canvas.width = width;
    canvas.height = height;

    // Очищаем холст (прозрачный фон)
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Перемещаем центр в середину холста
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Рассчитываем размер для вмещения исходника
    const scale = Math.min((width * 0.85) / img.width, (height * 0.85) / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [aspectRatio, panX, panY, rotation, zoom]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Мышиное перетаскивание (Pan)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setPanX((prev) => prev + dx);
    setPanY((prev) => prev + dy);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Удаление белого фона (Сделать белый фон прозрачным)
  const handleRemoveWhiteBg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsProcessing(true);
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Если пиксель практически белый (>235 во всех каналах)
        if (r > 235 && g > 235 && b > 235) {
          data[i + 3] = 0; // Делаем прозрачным
        } else if (r > 220 && g > 220 && b > 220) {
          // Мягкое сглаживание краев
          const factor = (255 - Math.max(r, g, b)) / 35;
          data[i + 3] = Math.round(data[i + 3] * factor);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Обновляем imageObjRef новым изображением
      const newImg = new Image();
      newImg.onload = () => {
        imageObjRef.current = newImg;
        setIsProcessing(false);
      };
      newImg.src = canvas.toDataURL("image/png");
    } catch {
      setIsProcessing(false);
    }
  };

  // Автоматическая обрезка пустых/прозрачных полей по краям
  const handleTrimWhitespace = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsProcessing(true);
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      let minX = w,
        minY = h,
        maxX = 0,
        maxY = 0;
      let found = false;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const alpha = data[idx + 3];
          // Если пиксель непрозрачный
          if (alpha > 15) {
            found = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (!found || minX >= maxX || minY >= maxY) {
        setIsProcessing(false);
        return;
      }

      // Добавим немного отступа (padding 10px)
      const pad = 12;
      minX = Math.max(0, minX - pad);
      minY = Math.max(0, minY - pad);
      maxX = Math.min(w, maxX + pad);
      maxY = Math.min(h, maxY + pad);

      const trimW = maxX - minX;
      const trimH = maxY - minY;

      const trimmedCanvas = document.createElement("canvas");
      trimmedCanvas.width = trimW;
      trimmedCanvas.height = trimH;
      const trimCtx = trimmedCanvas.getContext("2d");
      if (trimCtx) {
        trimCtx.drawImage(canvas, minX, minY, trimW, trimH, 0, 0, trimW, trimH);
        const newImg = new Image();
        newImg.onload = () => {
          imageObjRef.current = newImg;
          setPanX(0);
          setPanY(0);
          setZoom(1);
          setIsProcessing(false);
          renderCanvas();
        };
        newImg.src = trimmedCanvas.toDataURL("image/png");
      } else {
        setIsProcessing(false);
      }
    } catch {
      setIsProcessing(false);
    }
  };

  // Поворот на 90 градусов
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Сброс положения
  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
  };

  // Сохранить изменения
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const finalDataUrl = canvas.toDataURL("image/png");
    onSave(finalDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-5 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Редактор логотипа и обрезка
            </h3>
            <p className="text-xs text-gray-500">
              Масштабируйте, перемещайте за холст мышью, удаляйте лишние поля
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Область предпросмотра с шашечками (прозрачность) */}
        <div className="relative w-full bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center min-h-[220px] max-h-[360px] p-2">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-grab active:cursor-grabbing max-w-full max-h-[340px] shadow-sm rounded-lg"
          />
        </div>

        {/* Панель управления инструментами */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
          {/* Масштаб */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>Масштаб (Зум)</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#ea5670]"
            />
          </div>

          {/* Соотношение сторон холста */}
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold text-gray-700">
              Пропорции карточки
            </span>
            <div className="flex items-center gap-1.5">
              {(["3:1", "2:1", "1:1", "free"] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    aspectRatio === ratio
                      ? "bg-[#ea5670] border-[#ea5670] text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {ratio === "free" ? "Авто" : ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveWhiteBg}
            disabled={isProcessing}
            title="Превратить белый фоновый цвет в прозрачный"
          >
            ✨ Убрать белый фон
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTrimWhitespace}
            disabled={isProcessing}
            title="Обрезать лишние пустые поля вокруг логотипа"
          >
            ✂️ Авто-обрезка полей
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRotate}
            disabled={isProcessing}
          >
            🔄 Повернуть 90°
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-gray-500 ml-auto"
          >
            Сброс
          </Button>
        </div>

        {/* Футер модалки */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Отмена
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isProcessing}
          >
            {isProcessing ? "Обработка..." : "Применить результат"}
          </Button>
        </div>
      </div>
    </div>
  );
}
