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
  // Staggered sticky top offsets для красивого каскадного наслоения карточек (Stacking Cards)
  const stickyTop = `calc(90px + ${index * 24}px)`;

  return (
    <div
      className="sticky w-full transition-all duration-300 ease-out"
      style={{
        top: stickyTop,
        zIndex: index + 1,
      }}
    >
      <div className="w-full bg-[#FBFAF9] rounded-[28px] sm:rounded-[36px] border border-[#E5DFD5] p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] transition-shadow duration-500 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
          
          {/* Левая колонка: Текстовый контент и метаданные проекта */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div>
              {/* Заголовок проекта */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A0A0A] tracking-tight leading-tight mb-4">
                {project.title}
              </h3>

              {/* Описание */}
              <p className="text-sm sm:text-base text-[#525252] leading-relaxed mb-6 lg:mb-8 font-normal">
                {project.description}
              </p>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 mb-5" />

              {/* Строка: Клиент */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs sm:text-sm font-semibold text-[#737373] uppercase tracking-wider">
                  Клиент:
                </span>
                <span className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                  {project.client}
                </span>
              </div>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 my-4" />

              {/* Строка: Услуги */}
              <div className="flex items-center justify-between py-1 mb-8">
                <span className="text-xs sm:text-sm font-semibold text-[#737373] uppercase tracking-wider">
                  Услуги:
                </span>
                <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                  {project.services.map((service) => (
                    <span
                      key={service}
                      className="px-3.5 py-1.5 rounded-full bg-[#EAE0CF]/50 text-[#0A0A0A] text-xs font-semibold border border-[#D4C8B5]/60"
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
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0A0A0A] hover:bg-brand-pink text-white font-semibold text-sm transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
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
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[1184/1080] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-black/5 bg-[#EFECE6] group">
              <SafeImage
                src={project.imageSrc}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 580px"
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
  const items =
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : DEFAULT_WORK_DATA.items;

  return (
    <section id="work" className="w-full bg-[#F3EFE8] py-20 sm:py-28 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Заголовок секции */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#737373] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-pink" />
            {initialData?.subtitle || "Портфолио / Кейсы"}
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] tracking-tight leading-[1.1] mb-4">
            {initialData?.title || "Проекты, которые приносят результат"}
          </h2>
          <p className="text-base sm:text-lg text-[#525252] font-normal leading-relaxed">
            Реальные рекламные кампании на радио, магистральных щитах и в полиграфии для бизнеса в Балаково и Поволжье.
          </p>
        </div>

        {/* Стек карточек проектов с наслоением при скролле */}
        <div className="flex flex-col gap-12 sm:gap-16 pb-16">
          {items.map((project, index) => (
            <WorkCard key={project.id || index} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
