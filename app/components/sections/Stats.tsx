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
      className="relative w-full text-white px-4 sm:px-[30px] lg:px-10 2xl:px-12 pt-6 sm:pt-14 pb-8 sm:pb-20 overflow-hidden min-h-[480px] sm:min-h-[640px] lg:min-h-[680px] 2xl:min-h-[760px] flex flex-col justify-between"
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

      {/* Контентный контейнер с ограничением 1680px для гармонии на 2K экранах */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto flex flex-col justify-between flex-1">
        {/* Верхний блок: Метрики агентства - сбалансированное распределение по всей ширине на больших экранах */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-10 pb-4 sm:pb-8">
          {metrics.map((metric, idx) => {
            const alignClass =
              idx === 0
                ? "text-left items-start"
                : idx === 1
                ? "text-left sm:text-center sm:items-center"
                : "text-left sm:text-right sm:items-end";

            return (
              <div key={metric.value || idx} className={`flex flex-col ${alignClass}`}>
                <span className="font-sans text-lg sm:text-[22px] 2xl:text-[30px] font-semibold text-white mb-0.5 sm:mb-1 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {metric.value}
                </span>
                <span className="text-[11px] sm:text-[15px] 2xl:text-[17px] text-white/95 font-normal leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                  {metric.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Нижний блок: Оффер + кнопки в фирменных цветах и плавающие капсулы без стрелочек */}
        <div className="w-full pt-6 sm:pt-14 2xl:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-end">
          {/* Слева: Текстовый оффер и капсульные кнопки в фирменных цветах */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <p className="text-sm sm:text-xl lg:text-[22px] 2xl:text-[26px] text-white font-normal leading-relaxed mb-6 sm:mb-8 max-w-2xl 2xl:max-w-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {offerText}
            </p>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 2xl:px-8 py-3.5 sm:py-4 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-sm sm:text-base 2xl:text-lg shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all duration-200"
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
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 2xl:px-8 py-3.5 sm:py-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/50 text-white font-semibold text-sm sm:text-base 2xl:text-lg backdrop-blur-md shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
              >
                <span>Обсудить в Telegram ↗</span>
              </a>
            </div>
          </div>

          {/* Справа: Капсульные пилюли направлений агентства (без стрелочек) */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-2.5 sm:gap-3 2xl:gap-3.5">
            {pills.map((pill, idx) => (
              <a
                key={pill.label || idx}
                href={pill.href}
                className="inline-flex items-center px-5 2xl:px-7 py-2.5 2xl:py-3.5 rounded-full bg-black/40 hover:bg-brand-purple/60 border border-white/20 hover:border-white/40 text-white font-medium text-xs sm:text-sm 2xl:text-base backdrop-blur-md shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
              >
                <span>{pill.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const Stats = memo(BaseStats);
export default Stats;
