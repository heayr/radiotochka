import React, { memo } from "react";
import SafeImage from "@/app/components/SafeImage";
import {
  DEFAULT_STATS_DATA,
  type StatsSectionData,
} from "@/types/site-content";

interface StatsProps {
  initialData?: Partial<StatsSectionData>;
}

function BaseStats({ initialData }: StatsProps) {
  const metrics =
    initialData?.metrics && initialData.metrics.length > 0
      ? initialData.metrics
      : DEFAULT_STATS_DATA.metrics;

  const pills =
    initialData?.pills && initialData.pills.length > 0
      ? initialData.pills
      : DEFAULT_STATS_DATA.pills;

  const desktopBanner =
    initialData?.desktopBanner || DEFAULT_STATS_DATA.desktopBanner;
  const mobileBanner =
    initialData?.mobileBanner || DEFAULT_STATS_DATA.mobileBanner;
  const offerText =
    initialData?.offerText || DEFAULT_STATS_DATA.offerText;

  return (
    <section
      id="stats"
      className="relative w-full text-white px-[20px] sm:px-[30px] lg:px-[60px] pt-10 sm:pt-14 pb-12 sm:pb-20 overflow-hidden min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex flex-col justify-between"
    >
      {/* Сочная фото-подложка студии без темных глушащих фильтров */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Мобильная версия (9:16) */}
        <div className="block md:hidden relative w-full h-full">
          <SafeImage
            src={mobileBanner}
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
          <SafeImage
            src={desktopBanner}
            alt="Профессиональная вещательная студия Радиоточка"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          {/* Деликатный градиент слева под текст оффера, не глушащий яркость студии */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>
      </div>

      {/* Верхний блок: Метрики агентства */}
      <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 pb-6 sm:pb-8">
        {metrics.map((metric, idx) => (
          <div key={metric.value || idx} className="flex flex-col">
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
            {offerText}
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
              href="https://t.me/+79271370750"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Обсудить в Telegram ↗</span>
            </a>
          </div>
        </div>

        {/* Справа: Капсульные пилюли направлений агентства (без стрелочек) */}
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-2.5 sm:gap-3">
          {pills.map((pill, idx) => (
            <a
              key={pill.label || idx}
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
