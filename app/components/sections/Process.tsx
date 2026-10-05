"use client";

import React, { memo, useEffect, useRef } from "react";
import Image from "next/image";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
  tag: string;
}

const STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Исследование",
    tag: "DISCOVER",
    description:
      "Погружаемся в ваш продукт, портрет покупателя и локальный рынок Балаково и области, чтобы найти самые конверсионные точки контакта.",
    imageSrc: "/images/process/step-01.jpg",
  },
  {
    number: "02",
    title: "Медиаплан",
    tag: "STRATEGIZE",
    description:
      "Формируем точный тайминг: ротация в прайм-тайм на «Дорожном» и «Нашем Радио», ключевые цифровые экраны и частотность до расхода первого рубля.",
    imageSrc: "/images/process/step-02.jpg",
  },
  {
    number: "03",
    title: "Продакшн",
    tag: "EXECUTE",
    description:
      "Пишем цепляющий аудиоролик, привлекаем федеральных дикторов, создаем динамичную графику для медиафасадов и запускаем эфир день в день.",
    imageSrc: "/images/process/step-03.jpg",
  },
  {
    number: "04",
    title: "Аналитика",
    tag: "OPTIMIZE",
    description:
      "Отслеживаем входящий поток звонков и заявок, оперативно корректируем сетку вещания, масштабируем охват и предоставляем прозрачные отчеты.",
    imageSrc: "/images/process/step-04.jpg",
  },
];

function BaseProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number | null = null;
    let isIntersecting = false;

    // Скролл-анимация каскадного выплывания карточек (только на десктопе >= 1024px)
    const updateParallax = () => {
      if (window.innerWidth < 1024) {
        // На мобильных карточки сбрасываются в исходное положение без сдвига
        cardsRef.current.forEach((el) => {
          if (el) el.style.transform = "none";
        });
        return;
      }

      const rect = section.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Нормализованный прогресс скролла внутри секции [0, 1]
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));

      // Каскадные диапазоны появления для каждой из 4 карточек
      const thresholds = [
        { start: 0, end: 0.1 },
        { start: 0.08, end: 0.38 },
        { start: 0.35, end: 0.68 },
        { start: 0.65, end: 0.96 },
      ];

      cardsRef.current.forEach((el, index) => {
        if (!el) return;

        if (index === 0) {
          el.style.transform = "translate3d(0, 0px, 0)";
          return;
        }

        const { start, end } = thresholds[index];
        let cardProgress = 0;
        if (progress >= end) {
          cardProgress = 1;
        } else if (progress <= start) {
          cardProgress = 0;
        } else {
          cardProgress = (progress - start) / (end - start);
        }

        // Плавная кубическая функция смягчения (ease-out cubic)
        const ease = 1 - Math.pow(1 - cardProgress, 3);
        const startOffset = 420; // Исходный сдвиг снизу
        const translateY = startOffset * (1 - ease);

        el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      });
    };

    const onScroll = () => {
      if (!isIntersecting) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateParallax();
        rafId = null;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          updateParallax();
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
      { rootMargin: "200px 0px 200px 0px" }
    );

    observer.observe(section);
    updateParallax();

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
      className="relative w-full bg-[#0A0A0A] text-white lg:min-h-[230vh]"
    >
      {/* Закрепленный экран со сценой процесса на десктопе */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center px-[20px] sm:px-[30px] lg:px-[60px] py-12 lg:py-10 overflow-hidden">
        {/* Верхняя строка с заголовком и подзаголовком */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 lg:mb-10">
          <div>
            <span className="text-xs sm:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#ea5670] mb-2.5 block select-none">
              METHODOLOGY · PROCESS
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-[-0.03em] leading-[1.05]">
              Наш процесс
            </h2>
          </div>
          <p className="text-white/60 text-sm sm:text-base lg:text-[15px] font-normal leading-relaxed max-w-md text-left md:text-right">
            Дисциплинированный четырехэтапный фреймворк, который исключает догадки и обеспечивает прогнозируемый рост продаж.
          </p>
        </div>

        {/* Сетка карточек: 4 колонки на десктопе, горизонтальный свайп на мобильных */}
        <div className="w-full">
          <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory pb-4 lg:pb-0">
            {STEPS.map((step, idx) => (
              <div
                key={`process-step-${idx}`}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="group relative flex-shrink-0 w-[285px] sm:w-[320px] lg:w-auto h-[460px] sm:h-[480px] lg:h-[490px] xl:h-[510px] rounded-[24px] sm:rounded-[28px] overflow-hidden border border-white/10 hover:border-[#ea5670]/80 transition-all duration-500 ease-out snap-center cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(234,86,112,0.3)] will-change-transform"
              >
                {/* Фоновое атмосферное изображение */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={step.imageSrc}
                    alt={step.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 320px, 285px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={idx < 2}
                  />
                </div>

                {/* Темный градиентный слой для идеальной читаемости текста */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

                {/* Акцентная форма-вспышка (Shape), активирующаяся при наведении в стиле Framer */}
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#ea5670]/60 via-[#824e98]/40 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 ease-out mix-blend-color-dodge pointer-events-none" />

                {/* Содержимое карточки */}
                <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-7 select-none">
                  {/* Верхняя часть: метка и гигантский номер */}
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/85">
                      {step.tag}
                    </span>
                    <span className="text-6xl sm:text-7xl lg:text-[74px] font-black tracking-tighter text-white/95 leading-none transition-transform duration-500 group-hover:-translate-y-1.5">
                      {step.number}
                    </span>
                  </div>

                  {/* Нижняя часть: заголовок и дескриптор */}
                  <div>
                    <h3 className="text-2xl sm:text-[25px] font-bold text-white tracking-tight mb-2.5 transition-colors duration-300 group-hover:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-[14px] text-white/75 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const Process = memo(BaseProcess);
export default Process;
