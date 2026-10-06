"use client";

import React, { memo, useRef, useEffect } from "react";
import SafeImage from "@/app/components/SafeImage";
import {
  DEFAULT_PROCESS_DATA,
  type ProcessStepItem,
  type ProcessSectionData,
} from "@/types/site-content";

interface ProcessCardProps {
  step: ProcessStepItem;
  idx: number;
}

const ProcessCard = memo(function ProcessCard({ step, idx }: ProcessCardProps) {
  return (
    <div className="group relative w-full h-[440px] sm:h-[470px] lg:h-[460px] xl:h-[480px] rounded-[24px] sm:rounded-[28px] overflow-hidden border border-white/10 hover:border-[#ea5670]/80 transition-all duration-500 ease-out cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(234,86,112,0.35)] bg-[#111111] will-change-transform pointer-events-auto">
      {/* Фоновое атмосферное изображение без зума */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={step.imageSrc}
          alt={step.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center"
          priority={idx < 2}
        />
      </div>

      {/* Мягкая нижняя подсветка под приподнятым текстом */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 z-10 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none" />

      {/* Выразительный коралловый акцент под текстом при hover, охватывающий оптический центр */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#ea5670]/85 via-[#ea5670]/35 via-50% to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />

      {/* Содержимое карточки: текст приподнят ближе к оптической середине (pb-12 lg:pb-14 xl:pb-16) */}
      <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-7 pb-12 sm:pb-14 lg:pb-14 xl:pb-16 select-none">
        {/* Верхняя зона: воздушный тонкий номер на фиксированной высоте */}
        <div className="h-[64px] flex items-start justify-end">
          <span className="text-7xl sm:text-8xl lg:text-[84px] font-extralight tracking-tight text-white/70 group-hover:text-white transition-colors duration-500 leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            {step.number}
          </span>
        </div>

        {/* Зона контента: приподнята в фокусный центр карточки, строго по одной линии */}
        <div className="flex flex-col justify-end">
          <div className="h-[34px] flex items-end mb-2.5">
            <h3 className="text-2xl sm:text-[25px] font-bold text-white tracking-tight leading-tight transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {step.title}
            </h3>
          </div>
          <div className="h-[54px] flex items-start">
            <p className="text-sm sm:text-[14px] text-white/90 leading-[1.5] font-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Мобильный контейнер: при вертикальном скролле вниз карточки процесса плавно едут по горизонтали
 * С соблюдением Invariant 1.1 (useRef + direct DOM transforms) и Invariant 2.3 (IntersectionObserver)
 */
const MobileProcessTrack = memo(function MobileProcessTrack({
  steps,
}: {
  steps: ProcessStepItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let isVisible = false;
    let rafId: number | null = null;
    let maxTranslate = 0;

    const measure = () => {
      if (!track) return;
      const lastCard = track.lastElementChild as HTMLElement;
      if (lastCard) {
        const savedTransform = track.style.transform;
        track.style.transform = "translate3d(0, 0, 0)";
        const untranslatedLeft = lastCard.getBoundingClientRect().left;
        track.style.transform = savedTransform;

        const targetLeft = Math.max(16, (window.innerWidth - lastCard.offsetWidth) / 2);
        maxTranslate = Math.max(0, untranslatedLeft - targetLeft);
      } else {
        maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth + 40);
      }
    };

    const updateScroll = () => {
      if (!container || !track) return;

      const rect = container.getBoundingClientRect();
      const totalScroll = container.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1);

      // Горизонтальный скролл завершается на 75% пройденного пути,
      // чтобы 4-я карточка успела полностью встать по центру экрана и зафиксироваться,
      // дав пользователю комфортный запас скролла прочитать её до перехода к следующей секции.
      const horizontalProgress = Math.min(1, progress / 0.75);

      const translateX = horizontalProgress * maxTranslate;
      track.style.transform = `translate3d(${-translateX}px, 0, 0)`;

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const onScrollOrResize = () => {
      if (!isVisible) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        measure();
        updateScroll();
      });
    };

    measure();
    updateScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          measure();
          updateScroll();
          window.addEventListener("scroll", onScrollOrResize, { passive: true });
          window.addEventListener("resize", onScrollOrResize, { passive: true });
        } else {
          window.removeEventListener("scroll", onScrollOrResize);
          window.removeEventListener("resize", onScrollOrResize);
          if (rafId) cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [steps.length]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350vh] lg:hidden -mx-5 sm:-mx-7"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between py-6 px-4 bg-[#0A0A0A]">
        {/* Центр: Горизонтальный трек карточек */}
        <div className="flex-1 flex items-center overflow-hidden my-auto w-full">
          <div
            ref={trackRef}
            className="flex flex-row gap-4 will-change-transform items-stretch px-2"
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            {steps.map((step, idx) => (
              <div
                key={`mobile-step-${idx}`}
                className="w-[82vw] max-w-[320px] h-[430px] shrink-0"
              >
                <ProcessCard step={step} idx={idx} />
              </div>
            ))}
          </div>
        </div>

        {/* Нижняя панель: прогресс и подсказка */}
        <div className="w-full pt-2 pb-1 flex flex-col gap-2 border-t border-white/10">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressFillRef}
              className="h-full bg-brand-pink rounded-full origin-left will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/60 font-medium">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-pink animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
              Листайте вниз
            </span>
            <span>Скролл листает этапы →</span>
          </div>
        </div>
      </div>
    </div>
  );
});

interface ProcessProps {
  initialData?: Partial<ProcessSectionData>;
}

function BaseProcess({ initialData }: ProcessProps) {
  const steps =
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : DEFAULT_PROCESS_DATA.items;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const list = listRef.current;
    if (!section || !header || !list) return;

    let isIntersecting = false;
    let rafId: number | null = null;

    const updateFade = () => {
      if (window.innerWidth < 1024) {
        header.style.opacity = "1";
        header.style.transform = "none";
        return;
      }

      const listRect = list.getBoundingClientRect();
      const cardHeight = window.innerWidth >= 1280 ? 480 : 460;
      const stickyTop = window.innerWidth >= 1280 ? 245 : 220;
      const headerTop = window.innerWidth >= 1280 ? 85 : 70;

      // Точка, где полностью пристыкованные карточки начинают подниматься наверх
      const liftThreshold = stickyTop + cardHeight;

      if (listRect.bottom >= liftThreshold) {
        // Карточки прибывают или стоят в ряду -> заголовок полностью виден
        header.style.opacity = "1";
        header.style.transform = "translate3d(0, 0px, 0)";
      } else {
        // Карточки поднимаются вверх и перекрывают заголовок -> плавное растворение
        const currentCardsTop = listRect.bottom - cardHeight;
        const fadeDistance = stickyTop - headerTop; // ~150-165px

        if (currentCardsTop <= headerTop) {
          header.style.opacity = "0";
          header.style.transform = "translate3d(0, -20px, 0)";
        } else {
          const progress = (stickyTop - currentCardsTop) / fadeDistance;
          const opacity = Math.max(0, Math.min(1, 1 - progress));
          const translateY = -progress * 20;

          header.style.opacity = opacity.toFixed(3);
          header.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        }
      }
    };

    const onScroll = () => {
      if (!isIntersecting) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateFade();
        rafId = null;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          updateFade();
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
      { rootMargin: "150px 0px 150px 0px" }
    );

    observer.observe(section);
    updateFade();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-label="Наш процесс работы"
      className="relative w-full bg-[#0A0A0A] text-white py-16 sm:py-20 lg:py-[80px]"
    >
      <div className="w-full max-w-[1240px] mx-auto px-[20px] sm:px-[30px] flex flex-col items-center relative">
        {/* Заголовок в 2 строчки и описание: sticky с растворением при подъеме карточек */}
        <div
          ref={headerRef}
          className="w-full lg:sticky lg:top-[70px] xl:top-[85px] z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 lg:mb-10 pointer-events-none select-none will-change-transform"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-[-0.03em] leading-[1.05]">
              {initialData?.title ? (
                initialData.title
              ) : (
                <>Наш<br />процесс</>
              )}
            </h2>
          </div>
          <p className="text-white/60 text-sm sm:text-base lg:text-[15px] font-normal leading-relaxed max-w-md text-left md:text-right">
            Дисциплинированный четырехэтапный фреймворк, который исключает догадки и обеспечивает прогнозируемый рост продаж.
          </p>
        </div>

        {/* На мобильных устройствах: горизонтальный скролл при вертикальной прокрутке вниз */}
        <MobileProcessTrack steps={steps} />

        {/* На десктопе: аутентичный каскадный CSS Sticky Stacking из Framer Our Process */}
        <div
          ref={listRef}
          className="hidden lg:block w-full relative z-20 h-[1840px] xl:h-[1920px]"
        >
          {steps.map((step, idx) => (
            <div
              key={`desktop-step-${idx}`}
              className="sticky top-[220px] xl:top-[245px] w-full grid grid-cols-4 gap-4 xl:gap-5 h-[460px] xl:h-[480px] pointer-events-none"
            >
              {Array.from({ length: 4 }).map((_, colIdx) =>
                colIdx === idx ? (
                  <ProcessCard key={`card-${idx}`} step={step} idx={idx} />
                ) : (
                  <div key={`empty-${colIdx}`} />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Process = memo(BaseProcess);
export default Process;
