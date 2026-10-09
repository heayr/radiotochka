"use client";

import React, { memo } from "react";
import Link from "next/link";
import SafeImage from "@/app/components/SafeImage";
import {
  DEFAULT_WORK_DATA,
  type WorkProjectItem,
  type WorkSectionData,
} from "@/types/site-content";

const WorkCard = memo(function WorkCard({
  project,
  index,
}: {
  project: WorkProjectItem;
  index: number;
}) {
  // Staggered sticky top offsets для красивого каскадного наслоения карточек на десктопе (Stacking Cards)
  const stickyTop = `calc(90px + ${index * 24}px)`;

  return (
    <div
      className="relative lg:sticky top-auto lg:[top:var(--sticky-top)] w-full transition-all duration-300 ease-out"
      style={
        {
          "--sticky-top": stickyTop,
          zIndex: index + 1,
        } as React.CSSProperties
      }
    >
      <div className="w-full bg-[#FBFAF9] rounded-[24px] sm:rounded-[36px] 2xl:rounded-[44px] border border-[#E5DFD5] p-5 sm:p-10 lg:p-12 2xl:p-16 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] transition-shadow duration-500 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
          
          {/* Левая колонка: Текстовый контент и метаданные проекта */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between order-2 lg:order-1">
            <div>
              {/* Заголовок проекта */}
              <h3 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-[52px] font-extrabold text-[#0A0A0A] tracking-tight leading-tight mb-3 sm:mb-4 2xl:mb-6">
                {project.title}
              </h3>

              {/* Описание */}
              <p className="text-sm sm:text-base 2xl:text-lg text-[#525252] leading-relaxed mb-5 lg:mb-8 font-normal">
                {project.description}
              </p>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 mb-4 sm:mb-5 2xl:mb-6" />

              {/* Строка: Клиент */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider">
                  Клиент:
                </span>
                <span className="text-sm sm:text-base 2xl:text-lg font-bold text-[#0A0A0A]">
                  {project.client}
                </span>
              </div>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 my-3 sm:my-4 2xl:my-5" />

              {/* Строка: Услуги */}
              <div className="flex items-center justify-between py-1 mb-6 sm:mb-8 2xl:mb-10">
                <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider">
                  Услуги:
                </span>
                <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 2xl:gap-2.5">
                  {(Array.isArray(project.services) ? project.services : []).map((service, sIdx) => (
                    <span
                      key={`${service}-${sIdx}`}
                      className="px-3 py-1 sm:px-3.5 sm:py-1.5 2xl:px-4 2xl:py-2 rounded-full bg-[#EAE0CF]/50 text-[#0A0A0A] text-xs 2xl:text-sm font-semibold border border-[#D4C8B5]/60"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Кнопка / Ссылка на кейс */}
            <div>
              <Link
                href={project.href || "#contact"}
                className="group inline-flex items-center justify-center w-full sm:w-auto gap-2.5 px-6 2xl:px-8 py-3.5 2xl:py-4 rounded-full bg-[#0A0A0A] hover:bg-brand-pink text-white font-semibold text-sm 2xl:text-base transition-all duration-200 shadow-md hover:shadow-xl active:scale-[0.98]"
              >
                <span>Обсудить похожий проект</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Правая колонка: Изображение проекта */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[1184/1080] rounded-[18px] sm:rounded-[24px] 2xl:rounded-[32px] overflow-hidden border border-black/5 bg-[#EFECE6] group">
              <SafeImage
                src={project.imageSrc || (project as any).image || "/images/work/project-01.png"}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (min-width: 1536px) 760px, 580px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={index === 0}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

interface WorkProps {
  initialData?: Partial<WorkSectionData>;
}

export default function Work({ initialData }: WorkProps) {
  const rawItems =
    initialData?.items && Array.isArray(initialData.items) && initialData.items.length > 0
      ? initialData.items
      : [];

  const isCompatible =
    rawItems.length > 0 &&
    rawItems.some(
      (p) => p.client || (Array.isArray(p.services) && p.services.length > 0)
    );

  const items = isCompatible ? rawItems : DEFAULT_WORK_DATA.items;

  return (
    <section id="work" className="w-full bg-[#F3EFE8] pt-14 sm:pt-20 2xl:pt-24 pb-8 sm:pb-12 lg:pb-14 px-4 sm:px-8 lg:px-10 2xl:px-12">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        
        {/* Заголовок секции */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-10 sm:mb-20 2xl:mb-24">
          <p className="text-xs sm:text-sm 2xl:text-base font-semibold tracking-[0.2em] text-[#737373] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-pink" />
            {initialData?.subtitle || "Портфолио / Кейсы"}
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-[#0A0A0A] tracking-tight leading-[1.1] mb-4">
            {initialData?.title || "Проекты, которые приносят результат"}
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl text-[#525252] font-normal leading-relaxed">
            Реальные рекламные кампании на радио, магистральных щитах и в полиграфии для бизнеса в Балаково и Поволжье.
          </p>
        </div>

        {/* Стек карточек проектов с наслоением при скролле */}
        <div className="flex flex-col gap-8 sm:gap-16 pb-2 sm:pb-4">
          {items.map((project, index) => (
            <WorkCard
              key={project.id || index}
              project={{
                ...project,
                services: Array.isArray(project.services) ? project.services : [],
                imageSrc: project.imageSrc || (project as any).image || "/images/work/project-01.png",
              }}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
