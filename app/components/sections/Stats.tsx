import React, { memo } from "react";
import Image from "next/image";

const statsMetrics = [
  {
    value: "20+",
    label: "Лет успешной работы в Балаково",
  },
  {
    value: "80 000+",
    label: "Слушателей ежедневно в регионе",
  },
  {
    value: "100%",
    label: "Прямой эфирный пул без наценок",
  },
] as const;

const servicePills = [
  { label: "Прямой эфир 104.7 & 98.4 FM", href: "#radio" },
  { label: "Медиафасады и наружная реклама", href: "#services" },
  { label: "Аудио-продакшн за 24ч", href: "#services" },
  { label: "Широкоформатная печать", href: "#services" },
] as const;

function BaseStats() {
  return (
    <section
      id="stats"
      className="relative w-full text-white px-[20px] sm:px-[30px] lg:px-[60px] pt-10 sm:pt-14 pb-12 sm:pb-20 overflow-hidden min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex flex-col justify-between"
    >
      {/* Сочная фото-подложка студии без темных глушащих фильтров */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Мобильная версия (9:16) */}
        <div className="block md:hidden relative w-full h-full">
          <Image
            src="/images/stats-banner-mobile.jpg"
            alt="Студия прямого эфира Радиоточка"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          {/* Легкая деликатная вуаль сверху и снизу исключительно для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        </div>

        {/* Десктоп / Планшет (16:9) */}
        <div className="hidden md:block relative w-full h-full">
          <Image
            src="/images/stats-banner-desktop.jpg"
            alt="Профессиональная вещательная студия Радиоточка"
            fill
            sizes="100vw"
            priority
            quality={92}
            className="object-cover object-center"
          />
          {/* Деликатный градиент слева под текст оффера, не глушащий яркость студии */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>
      </div>

      {/* Верхний блок: Метрики агентства (оригинальный изящный шрифт, без разделителя) */}
      <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 pb-6 sm:pb-8">
        {statsMetrics.map((metric) => (
          <div key={metric.value} className="flex flex-col">
            <span className="font-sans text-xl sm:text-[22px] font-semibold text-white mb-1 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {metric.value}
            </span>
            <span className="text-sm sm:text-[15px] text-white/95 font-normal leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              {metric.label}
            </span>
          </div>
        ))}
      </div>

      {/* Нижний блок: Оффер + кнопки в фирменных цветах и плавающие капсулы без стрелочек */}
      <div className="relative z-10 w-full pt-10 sm:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end">
        {/* Слева: Текстовый оффер и капсульные кнопки в фирменных цветах */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <p className="text-base sm:text-xl lg:text-[22px] text-white font-normal leading-relaxed mb-8 max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Медиапланирование, радиоэфир «Дорожное радио» и «Наше Радио», наружные экраны и полиграфия — созданы масштабировать ваш бизнес и привлекать реальных покупателей.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <a
              href="tel:+79271370750"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-sm sm:text-base shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Запустить проект</span>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>

            <a
              href="#calculator"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Получить расчет ↗</span>
            </a>
          </div>
        </div>

        {/* Справа: Капсульные пилюли направлений агентства (без стрелочек) */}
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-2.5 sm:gap-3">
          {servicePills.map((pill) => (
            <a
              key={pill.label}
              href={pill.href}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-black/40 hover:bg-brand-purple/50 border border-white/20 hover:border-white/40 text-white font-medium text-xs sm:text-sm backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{pill.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const Stats = memo(BaseStats);
export default Stats;
