"use client";

import React, { memo, useEffect, useRef } from "react";
import {
  DEFAULT_MANIFESTO_DATA,
  type ManifestoSectionData,
} from "@/types/site-content";

interface ManifestoProps {
  initialData?: Partial<ManifestoSectionData>;
}

function BaseManifesto({ initialData }: ManifestoProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const text = initialData?.text || DEFAULT_MANIFESTO_DATA.text;
  const since = initialData?.since || DEFAULT_MANIFESTO_DATA.since;
  const cities = initialData?.cities && initialData.cities.length > 0
    ? initialData.cities
    : DEFAULT_MANIFESTO_DATA.cities;

  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordEls = wordsRef.current;
    const totalWords = words.length;
    let rafId: number | null = null;
    let isIntersecting = false;

    const updateWords = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Скролл-прогресс: раскрытие начинается при входе блока в область видимости
      const startY = windowHeight * 0.85;
      const endY = windowHeight * 0.35;
      const totalDist = startY - endY;
      const progress = Math.min(Math.max((startY - rect.top) / totalDist, 0), 1);

      for (let i = 0; i < totalWords; i++) {
        const el = wordEls[i];
        if (!el) continue;

        const wordStart = i / totalWords;
        const wordEnd = (i + 1) / totalWords;

        let wordProgress = 0;
        if (progress >= wordEnd) {
          wordProgress = 1;
        } else if (progress <= wordStart) {
          wordProgress = 0;
        } else {
          wordProgress = (progress - wordStart) / (wordEnd - wordStart);
        }

        // Аппаратная анимация прозрачности от элегантного серого (0.24) до глубокого черного (1.0)
        const opacity = 0.24 + 0.76 * wordProgress;
        el.style.opacity = opacity.toFixed(3);
      }
    };

    const onScroll = () => {
      if (!isIntersecting) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateWords();
        rafId = null;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          updateWords();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll, { passive: true });
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        }
      },
      { rootMargin: "100px 0px 100px 0px" }
    );

    observer.observe(container);
    updateWords();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [words.length]);

  return (
    <section
      ref={containerRef}
      id="manifesto"
      className="w-full bg-[#F4F0EB] px-[20px] sm:px-[30px] lg:px-[60px] pt-16 sm:pt-24 pb-12 sm:pb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
        {/* Левая колонка со списком городов и годом основания */}
        <div className="lg:col-span-3 flex flex-row flex-wrap lg:flex-col gap-x-4 gap-y-1.5 text-xs sm:text-[13px] font-normal tracking-[0.16em] text-[#8C8780] uppercase select-none pt-1">
          <span>{since}</span>
          {cities.map((city) => (
            <span key={city} className="flex items-center gap-2">
              <span className="lg:hidden text-[#8C8780]/40">•</span>
              {city}
            </span>
          ))}
        </div>

        {/* Правая колонка: Элегантная скругленная типографика с пословным проявлением при скролле */}
        <div className="lg:col-span-9">
          <p className="text-xl sm:text-3xl lg:text-[38px] xl:text-[40px] font-medium text-[#0A0A0A] leading-[1.38] tracking-[-0.02em] max-w-4xl">
            {words.map((word, idx) => (
              <span
                key={`word-${idx}`}
                ref={(el) => {
                  wordsRef.current[idx] = el;
                }}
                className="inline-block mr-[0.28em] transition-opacity duration-150 will-change-[opacity]"
                style={{ opacity: 0.24 }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

const Manifesto = memo(BaseManifesto);
export default Manifesto;
