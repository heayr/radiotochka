"use client";

import React, { memo } from "react";
import Button from "./Button";
import SafeImage from "./SafeImage";
import {
  DEFAULT_SERVICES_DATA,
  type ServiceCardItem,
  type ServicesSectionData,
} from "@/types/site-content";

/**
 * Мобильная карточка услуги (чистый, компактный, негромоздкий дизайн без наслоения)
 */
const MobileServiceCard = memo(function MobileServiceCard({
  service,
  index,
}: {
  service: ServiceCardItem;
  index: number;
}) {
  return (
    <div
      className="w-full rounded-[22px] p-5 sm:p-6 border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex flex-col justify-between"
      style={{
        backgroundColor: "#111216",
        backgroundImage: `
          radial-gradient(ellipse 100% 60% at 20% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse 80% 50% at 90% 100%, rgba(234, 86, 112, 0.12) 0%, transparent 60%),
          linear-gradient(135deg, #181920 0%, #101115 100%)
        `,
      }}
    >
      <div>
        {/* Верхняя строка: Категория и номер */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-white/60 tracking-wider uppercase truncate">
            {service.category}
          </span>
          <span className="text-xs font-mono font-bold text-white/90 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 shrink-0">
            {service.id || `0${index + 1}`}
          </span>
        </div>

        {/* Фотография превью (16:9) */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 mb-3.5 group">
          <SafeImage
            src={service.image || "/images/services/service-01-radio-real.jpg"}
            alt={service.alt || service.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            priority={index === 0}
          />
        </div>

        {/* Заголовок */}
        <h3 className="text-xl font-bold text-white tracking-tight leading-snug mb-2">
          {service.title}
        </h3>

        {/* Метрика */}
        {service.statNumber && (
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-black text-white tracking-tight">
              {service.statNumber}
            </span>
            {service.statLabel && (
              <span className="text-xs text-white/70 font-normal">
                {service.statLabel}
              </span>
            )}
          </div>
        )}

        {/* Описание */}
        {service.description && (
          <p className="text-xs sm:text-sm text-white/75 font-normal leading-relaxed mb-3.5">
            {service.description}
          </p>
        )}

        {/* Теги-плашки (аккуратные компактные бейджи, НЕ громоздкие блоки) */}
        {Array.isArray(service.tags) && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {service.tags.map((tag, tIdx) => (
              <span
                key={`${tag}-${tIdx}`}
                className="bg-[#F0ECE4] text-[#0A0A0A] font-bold text-[11px] px-2.5 py-1 rounded-lg leading-tight"
              >
                {tag.replace(/\n/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Кнопка действия */}
      <Button
        href="tel:+79271370750"
        variant="primary"
        size="sm"
        className="!w-full !inline-flex items-center justify-center gap-2 !py-2.5 !rounded-xl !bg-[#FF385C] hover:!bg-[#E02D50] !border-transparent !text-white font-semibold text-xs shadow-md active:scale-95 transition-all mt-auto"
      >
        <span>Запустить проект</span>
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </Button>
    </div>
  );
});

/**
 * Атомарная карточка услуги с каскадным наслоением (Stacking Cards) для ДЕСКТОПА
 * НА ВСЮ ШИРИНУ ЭКРАНА (100% full screen width, без ограничения контейнера)
 */
const ServiceCard = memo(function ServiceCard({
  service,
  index,
}: {
  service: ServiceCardItem;
  index: number;
}) {
  // Каскадный отступ сверху для наслоения карточек при скролле
  const stickyTop = `calc(75px + ${index * 22}px)`;

  return (
    <div
      className="relative lg:sticky w-full transition-all duration-300 ease-out top-auto lg:[top:var(--sticky-top)]"
      style={
        {
          "--sticky-top": stickyTop,
          zIndex: index + 1,
        } as React.CSSProperties
      }
    >
      <div
        className="w-full py-6 sm:py-10 lg:py-12 2xl:py-16 px-4 sm:px-10 lg:px-12 2xl:px-16 border-t border-b border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        style={{
          backgroundColor: "#101115",
          backgroundImage: `
            radial-gradient(ellipse 110% 70% at 20% -5%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%),
            radial-gradient(ellipse 80% 50% at 88% 105%, rgba(255, 51, 102, 0.15) 0%, transparent 60%),
            linear-gradient(135deg, #1C1E25 0%, #101116 35%, #181A21 68%, #0A0B0E 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='flakes'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23flakes)' opacity='0.45'/%3E%3C/svg%3E")
          `,
          backgroundBlendMode: "screen, screen, normal, overlay",
        }}
      >
        <div className="w-full max-w-[1680px] mx-auto flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-stretch">
          {/* ЛЕВАЯ КОЛОНКА: Номер + Портретное фото */}
          <div className="flex gap-3 sm:gap-6 items-start shrink-0">
            <span className="text-lg sm:text-2xl 2xl:text-3xl font-extrabold text-white/90 tracking-tight shrink-0 pt-1">
              {service.id}
            </span>

            <div className="relative w-full sm:w-[280px] md:w-[320px] lg:w-[340px] xl:w-[380px] 2xl:w-[440px] aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] rounded-[18px] sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 group shrink-0">
              <SafeImage
                src={service.image}
                alt={service.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 340px, (min-width: 1536px) 440px, 380px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority={index === 0}
              />
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Заголовок, кнопка, метрика и 3 бежевые плашки */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              {/* Верхняя строка: Категория слева, кнопка Start your project ↗ в правом углу */}
              <div className="flex items-center justify-between gap-4 mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm 2xl:text-base font-medium text-white/60 tracking-normal">
                  {service.category}
                </span>

                <Button
                  href="tel:+79271370750"
                  variant="primary"
                  size="sm"
                  className="!inline-flex !w-auto items-center gap-2 !px-6 2xl:!px-8 !py-2.5 sm:!py-3 2xl:!py-3.5 !rounded-full !bg-[#FF385C] hover:!bg-[#E02D50] !border-transparent !text-white font-semibold text-xs sm:text-sm 2xl:text-base shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  <span>Запустить проект</span>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </Button>
              </div>

              {/* Крупный заголовок в точности по референсу */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-[54px] font-extrabold text-white tracking-tight leading-[1.12] mb-5 sm:mb-6 2xl:mb-8">
                {service.title}
              </h3>

              {/* Метрика и текстовое описание */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mb-2.5">
                  <span className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-extrabold text-white tracking-tight">
                    {service.statNumber}
                  </span>
                  <span className="text-base sm:text-lg lg:text-xl 2xl:text-2xl text-white/70 font-normal">
                    {service.statLabel}
                  </span>
                </div>
                <p className="text-sm sm:text-base 2xl:text-lg text-white/75 font-normal leading-relaxed max-w-4xl 2xl:max-w-5xl">
                  {service.description}
                </p>
              </div>
            </div>

            {/* 3 КРУПНЫЕ СВЕТЛО-БЕЖЕВЫЕ КАРТОЧКИ В РЯД (ТОЧНО КАК В РЕФЕРЕНСЕ) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 2xl:gap-5 w-full mt-auto pt-2">
              {(Array.isArray(service.tags) ? service.tags : []).map((tag, tagIdx) => (
                <div
                  key={`${tag}-${tagIdx}`}
                  className="bg-[#F0ECE4] text-[#0A0A0A] font-bold text-sm sm:text-base 2xl:text-lg p-5 sm:p-6 2xl:p-7 rounded-2xl sm:rounded-3xl shadow-sm min-h-[110px] sm:min-h-[125px] 2xl:min-h-[140px] flex items-center justify-start text-left whitespace-pre-line leading-snug transition-transform hover:scale-[1.02]"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

interface ServicesProps {
  initialData?: Partial<ServicesSectionData>;
}

function BaseServices({ initialData }: ServicesProps) {
  const rawItems =
    initialData?.items && Array.isArray(initialData.items) && initialData.items.length > 0
      ? initialData.items
      : [];

  // Защита от старых записей в БД без полей tags/statNumber
  const isCompatible =
    rawItems.length > 0 &&
    rawItems.some(
      (it) => it.statNumber || (Array.isArray(it.tags) && it.tags.length > 0)
    );

  const items = isCompatible ? rawItems : DEFAULT_SERVICES_DATA.items;

  return (
    <section id="services" className="w-full bg-[#F3EFE8] pt-12 sm:pt-24 2xl:pt-32 pb-16 sm:pb-32 2xl:pb-40">
      {/* ЗАГОЛОВОК СЕКЦИИ */}
      <div className="w-full px-4 sm:px-8 lg:px-12 text-center max-w-5xl 2xl:max-w-6xl mx-auto mb-8 sm:mb-14 lg:mb-20 2xl:mb-24">
        <p className="text-xs sm:text-sm 2xl:text-base font-semibold tracking-[0.2em] text-[#737373] uppercase mb-3 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-pink" />
          Радиоточка / Спектр услуг
        </p>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold text-[#0A0A0A] tracking-tight leading-[1.15] mb-3 sm:mb-4">
          {initialData?.title || "Продвижение вашего бизнеса по всем направлениям в Балаково"}
        </h2>
        <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl text-[#555555] font-normal leading-relaxed max-w-2xl 2xl:max-w-3xl mx-auto">
          Радиоэфир, наружная реклама, собственная звуковая студия и полиграфия. Более 20 лет работаем с ведущими предпринимателями региона.
        </p>
      </div>

      {/* МОБИЛЬНАЯ ВЕРСИЯ: Чистый аккуратный вертикальный список без наслоения и громоздкости */}
      <div className="flex flex-col gap-5 lg:hidden px-4">
        {items.map((service, index) => (
          <MobileServiceCard
            key={service.id || index}
            service={{
              ...service,
              image: service.image || (service as any).imageSrc || "/images/services/service-01-radio-real.jpg",
              tags: Array.isArray(service.tags) ? service.tags : [],
            }}
            index={index}
          />
        ))}
      </div>

      {/* ДЕСКТОП: КАСКАДНОЕ НАСЛОЕНИЕ КАРТОЧЕК ВО ВСЮ ШИРИНУ ЭКРАНА */}
      <div className="hidden lg:flex flex-col w-full">
        {items.map((service, index) => (
          <ServiceCard
            key={service.id || index}
            service={{
              ...service,
              image: service.image || (service as any).imageSrc || "/images/services/service-01-radio-real.jpg",
              tags: Array.isArray(service.tags) ? service.tags : [],
            }}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

const Services = memo(BaseServices);
export default Services;

