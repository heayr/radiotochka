"use client";

import React, { useEffect, useState } from "react";

interface ToastEventDetail {
  message: string;
  duration?: number;
}

export function showToast(message: string, duration = 3200) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>("app-show-toast", {
        detail: { message, duration },
      })
    );
  }
}

/**
 * Умная функция копирования в буфер обмена с мгновенным тостом
 */
export async function copyToClipboard(
  text: string,
  successMessage: string = "Скопировано в буфер обмена"
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback для старых окружений
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    showToast(successMessage);
    return true;
  } catch (err) {
    console.warn("Clipboard copy failed, fallback display:", err);
    showToast(text);
    return false;
  }
}

export default function Toast() {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      const { message, duration = 3200 } = customEvent.detail || {};
      if (!message) return;

      if (timer) clearTimeout(timer);
      const id = Date.now();
      setToast({ message, id });

      timer = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, duration);
    };

    window.addEventListener("app-show-toast", handleToastEvent);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("app-show-toast", handleToastEvent);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] max-w-sm sm:max-w-md animate-fade-in pointer-events-auto"
    >
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-[#111113]/95 text-white border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="w-2.5 h-2.5 rounded-full bg-[#EA5670] shrink-0 animate-pulse" />
        <span className="text-xs sm:text-sm font-medium tracking-tight text-white/95">
          {toast.message}
        </span>
        <button
          type="button"
          onClick={() => setToast(null)}
          aria-label="Закрыть уведомление"
          className="ml-auto p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
