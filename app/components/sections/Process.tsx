"use client";

import React, { memo, useRef, useEffect } from "react";
import Image from "next/image";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
}

const STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Исследование",
    description:
      "Анализируем аудиторию и рынок, находя самые конверсионные точки контакта.",
    imageSrc: "/images/process/step-01.jpg",
  },
  {
    number: "02",
    title: "Медиаплан",
    description:
      "Подбираем прайм-тайм станций и экраны под ваш бюджет без лишних переплат.",
    imageSrc: "/images/process/step-02.jpg",
  },
  {
    number: "03",
    title: "Продакшн",
    description:
      "Создаем цепляющий ролик с дикторами и запускаем эфир день в день.",
    imageSrc: "/images/process/step-03.jpg",
  },
  {
    number: "04",
    title: "Аналитика",
    description:
      "Отслеживаем входящие звонки и масштабируем охват с прозрачными отчетами.",
    imageSrc: "/images/process/step-04.jpg",
  },
];

interface ProcessCardProps {
  step: ProcessStep;
  idx: number;
}

const ProcessCard = memo(function ProcessCard({ step, idx }: ProcessCardProps) {
  return (
    <div className="group relative w-full h-[440px] sm:h-[470px] lg:h-[460px] xl:h-[480px] rounded-[24px] sm:rounded-[28px] overflow-hidden border border-white/10 hover:border-[#ea5670]/80 transition-all duration-500 ease-out cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(234,86,112,0.35)] bg-[#111111] will-change-transform pointer-events-auto">
      {/* Фоновое атмосферное изображение без зума */}
      <div className="absolute inset-0 z-0">
        <Image
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

function BaseProcess() {
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
              Наш<br />процесс
            </h2>
          </div>
          <p className="text-white/60 text-sm sm:text-base lg:text-[15px] font-normal leading-relaxed max-w-md text-left md:text-right">
            Дисциплинированный четырехэтапный фреймворк, который исключает догадки и обеспечивает прогнозируемый рост продаж.
          </p>
        </div>

        {/* На мобильных устройствах: удобный горизонтальный скролл со snap */}
        <div className="w-full lg:hidden flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
          {STEPS.map((step, idx) => (
            <div key={`mobile-step-${idx}`} className="w-[285px] sm:w-[320px] shrink-0 snap-center">
              <ProcessCard step={step} idx={idx} />
            </div>
          ))}
        </div>

        {/* На десктопе: аутентичный каскадный CSS Sticky Stacking из Framer Our Process */}
        <div
          ref={listRef}
          className="hidden lg:block w-full relative z-20 h-[1840px] xl:h-[1920px]"
        >
          {/* Слой 01: прилипает на top-[220px]/[245px], остается на месте пока остальные слои приплывают */}
          <div className="sticky top-[220px] xl:top-[245px] w-full grid grid-cols-4 gap-4 xl:gap-5 h-[460px] xl:h-[480px] pointer-events-none">
            <ProcessCard step={STEPS[0]} idx={0} />
            <div />
            <div />
            <div />
          </div>

          {/* Слой 02: приплывает снизу ровно через высоту карточки скролла и прилипает рядом с шагом 01 */}
          <div className="sticky top-[220px] xl:top-[245px] w-full grid grid-cols-4 gap-4 xl:gap-5 h-[460px] xl:h-[480px] pointer-events-none">
            <div />
            <ProcessCard step={STEPS[1]} idx={1} />
            <div />
            <div />
          </div>

          {/* Слой 03: приплывает снизу ровно через высоту карточки скролла и прилипает рядом с шагом 02 */}
          <div className="sticky top-[220px] xl:top-[245px] w-full grid grid-cols-4 gap-4 xl:gap-5 h-[460px] xl:h-[480px] pointer-events-none">
            <div />
            <div />
            <ProcessCard step={STEPS[2]} idx={2} />
            <div />
          </div>

          {/* Слой 04: приплывает снизу и замыкает 4-колоночный ряд; после чего весь блок дружно уходит наверх */}
          <div className="sticky top-[220px] xl:top-[245px] w-full grid grid-cols-4 gap-4 xl:gap-5 h-[460px] xl:h-[480px] pointer-events-none">
            <div />
            <div />
            <div />
            <ProcessCard step={STEPS[3]} idx={3} />
          </div>
        </div>
      </div>
    </section>
  );
}

const Process = memo(BaseProcess);
export default Process;
