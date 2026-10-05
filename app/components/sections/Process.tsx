"use client";

import React, { memo, useEffect, useRef } from "react";
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
      "Погружаемся в ваш продукт, портрет покупателя и локальный рынок Балаково и области, чтобы найти самые конверсионные точки контакта.",
    imageSrc: "/images/process/step-01.jpg",
  },
  {
    number: "02",
    title: "Медиаплан",
    description:
      "Формируем точный тайминг: ротация в прайм-тайм на «Дорожном» и «Нашем Радио», ключевые цифровые экраны и частотность до расхода первого рубля.",
    imageSrc: "/images/process/step-02.jpg",
  },
  {
    number: "03",
    title: "Продакшн",
    description:
      "Пишем цепляющий аудиоролик, привлекаем федеральных дикторов, создаем динамичную графику для медиафасадов и запускаем эфир день в день.",
    imageSrc: "/images/process/step-03.jpg",
  },
  {
    number: "04",
    title: "Аналитика",
    description:
      "Отслеживаем входящий поток звонков и заявок, оперативно корректируем сетку вещания, масштабируем охват и предоставляем прозрачные отчеты.",
    imageSrc: "/images/process/step-04.jpg",
  },
];

function BaseProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number | null = null;
    let isIntersecting = false;

    // Скролл-анимация: каскадное появление карточек + наплыв карточек на текст (десктоп >= 1024px)
    const updateParallax = () => {
      if (window.innerWidth < 1024) {
        // На мобильных устройствах все карточки открыты для удобного свайпа
        if (cardsTrackRef.current) {
          cardsTrackRef.current.style.transform = "none";
        }
        cardsRef.current.forEach((el) => {
          if (el) {
            el.style.transform = "none";
            el.style.opacity = "1";
          }
        });
        if (headerRef.current) {
          headerRef.current.style.transform = "none";
          headerRef.current.style.opacity = "1";
        }
        return;
      }

      const rect = section.getBoundingClientRect();
      const stickyDiv = section.firstElementChild as HTMLElement | null;
      const stickyHeight = stickyDiv ? stickyDiv.offsetHeight : 500;
      const stickyTop = 50;
      const totalScrollable = Math.max(1, rect.height - stickyHeight - stickyTop - 48);
      if (totalScrollable <= 0) return;

      // Нормализованный прогресс скролла внутри диапазона прилипания [0, 1]
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));

      // Расчет высоты шапки для аккуратного наплыва
      const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 140;
      const initialTrackOffset = Math.max(140, headerHeight + 24);

      // Фаза 1: Каскадное выплывание карточек 02, 03, 04 снизу экрана
      // Карточка 01 зафиксирована на месте под шапкой
      // Карточки 02, 03, 04 поднимаются по очереди из-за нижнего края
      const cardRanges = [
        { start: 0, end: 0.05 },
        { start: 0.08, end: 0.28 },
        { start: 0.26, end: 0.48 },
        { start: 0.46, end: 0.68 },
      ];

      const startOffset = 550; // Сдвиг вниз за нижний край экрана

      cardsRef.current.forEach((el, index) => {
        if (!el) return;

        if (index === 0) {
          el.style.transform = "translate3d(0, 0px, 0)";
          el.style.opacity = "1";
          return;
        }

        const { start, end } = cardRanges[index];
        let p = 0;
        if (progress >= end) {
          p = 1;
        } else if (progress <= start) {
          p = 0;
        } else {
          p = (progress - start) / (end - start);
        }

        // Плавная кубическая функция смягчения (ease-out cubic)
        const ease = 1 - Math.pow(1 - p, 3);
        const translateY = (1 - ease) * startOffset;
        const opacity = Math.min(1, p * 1.8);

        el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        el.style.opacity = opacity.toFixed(3);
      });

      // Фаза 2: Когда все карточки собрались в ряд (progress >= 0.70),
      // весь трек с карточками поднимается вверх, наплывая на текст и перекрывая его
      const liftStart = 0.72;
      const liftEnd = 0.94;
      let liftP = 0;

      if (progress >= liftEnd) {
        liftP = 1;
      } else if (progress <= liftStart) {
        liftP = 0;
      } else {
        liftP = (progress - liftStart) / (liftEnd - liftStart);
      }

      const liftEase = 1 - Math.pow(1 - liftP, 3);
      const currentTrackY = (1 - liftEase) * initialTrackOffset;

      if (cardsTrackRef.current) {
        cardsTrackRef.current.style.transform = `translate3d(0, ${currentTrackY.toFixed(1)}px, 0)`;
      }

      // Текст шапки мягко растворяется по мере наплыва карточек
      if (headerRef.current) {
        if (liftP > 0) {
          const headerFade = Math.max(0, 1 - liftP * 1.4);
          headerRef.current.style.opacity = headerFade.toFixed(3);
        } else {
          headerRef.current.style.opacity = "1";
        }
      }
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
      className="relative w-full bg-[#0A0A0A] text-white pt-8 sm:pt-10 lg:pt-12 pb-10 sm:pb-12 lg:min-h-[250vh]"
    >
      {/* Закрепленный контейнер сцены на десктопе с точным отступом сверху */}
      <div className="w-full px-[20px] sm:px-[30px] lg:px-[60px] lg:sticky lg:top-[50px] relative overflow-hidden lg:overflow-visible">
        {/* Заголовок в 2 строчки и описание: на десктопе позиционирован абсолютно, чтобы карточки могли наплыть на него */}
        <div
          ref={headerRef}
          className="relative lg:absolute lg:top-0 lg:left-[60px] lg:right-[60px] z-10 w-full lg:w-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 lg:mb-0 pointer-events-none select-none transition-opacity duration-200 will-change-transform"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-[-0.03em] leading-[1.05]">
              Наш<br />процесс
            </h2>
          </div>
          <p className="text-white/60 text-sm sm:text-base lg:text-[15px] font-normal leading-relaxed max-w-md text-left md:text-right">
            Дисциплинированный четырехэтапный фреймворк, который исключает догадки и обеспечивает прогнозируемый рост продаж.
          </p>
        </div>

        {/* Трек карточек: z-20 поверх текста, поднимается вверх на финальной фазе */}
        <div ref={cardsTrackRef} className="relative z-20 w-full will-change-transform">
          <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory pb-2 lg:pb-0">
            {STEPS.map((step, idx) => (
              <div
                key={`process-step-${idx}`}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="group relative flex-shrink-0 w-[285px] sm:w-[320px] lg:w-auto h-[480px] xl:h-[500px] rounded-[24px] sm:rounded-[28px] overflow-hidden border border-white/10 hover:border-[#ea5670]/80 transition-all duration-500 ease-out snap-center cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(234,86,112,0.35)] will-change-transform bg-[#111111]"
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

                {/* Содержимое карточки: только номер и русский текст */}
                <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-7 select-none">
                  {/* Верхняя часть: крупный номер шага без лишних плашек */}
                  <div className="flex justify-end">
                    <span className="text-6xl sm:text-7xl lg:text-[76px] font-black tracking-tighter text-white/95 leading-none transition-transform duration-500 group-hover:-translate-y-1.5">
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
