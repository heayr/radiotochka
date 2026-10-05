"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";

interface WorkProject {
  id: string;
  title: string;
  description: string;
  client: string;
  services: string[];
  imageSrc: string;
  href: string;
}

const PROJECTS: WorkProject[] = [
  {
    id: "01",
    title: "Alongside",
    description:
      "Комплексный ребрендинг и запуск федеральной рекламной кампании: разработка позиционирования, создание аудиороликов и ротация в эфире радиостанций.",
    client: "Lumina Legal",
    services: ["Айдентика", "Радиоэфир"],
    imageSrc: "/images/work/project-01.png",
    href: "#contact",
  },
  {
    id: "02",
    title: "Hypertech",
    description:
      "Кросс-канальная рекламная кампания: магистральные щиты 3х6 м в ключевых локациях города, аудио-джинглы в прайм-тайм и оперативная полиграфия.",
    client: "FitFuel Nutrition",
    services: ["Наружная реклама", "Аудиопродакшн"],
    imageSrc: "/images/work/project-02.png",
    href: "#contact",
  },
  {
    id: "03",
    title: "Redefine Flow",
    description:
      "Стратегический медиаплан и брендинг: позиционирование на региональном рынке, сити-форматы с высоким трафиком и спонсорские интеграции.",
    client: "Verge Consulting",
    services: ["Медиаплан", "Брендинг"],
    imageSrc: "/images/work/project-03.png",
    href: "#contact",
  },
  {
    id: "04",
    title: "Recap",
    description:
      "Пакетное размещение на радиостанциях «Дорожное радио» и «НАШЕ Радио» с охватом всей агломерации и точным попаданием в целевую аудиторию.",
    client: "Harbor Financial",
    services: ["Прямой эфир", "Спонсорство"],
    imageSrc: "/images/work/project-04.png",
    href: "#contact",
  },
];

const WorkCard = memo(function WorkCard({
  project,
  index,
}: {
  project: WorkProject;
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
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-pink" />
                  <span className="text-sm sm:text-base font-bold text-[#0A0A0A]">
                    {project.client}
                  </span>
                </div>
              </div>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 my-5" />

              {/* Строка: Услуги / Теги */}
              <div className="flex items-center justify-between py-1 mb-8">
                <span className="text-xs sm:text-sm font-semibold text-[#737373] uppercase tracking-wider">
                  Услуги:
                </span>
                <div className="flex flex-wrap gap-2 justify-end">
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
                href={project.href}
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

          {/* Правая колонка: Высококачественное изображение проекта */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full aspect-[1184/1080] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-black/5 bg-[#EFECE6] group">
              <Image
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

export default function Work() {
  return (
    <section id="work" className="w-full bg-[#F3EFE8] py-20 sm:py-28 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Заголовок секции */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#737373] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-pink" />
            Портфолио / Кейсы
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] tracking-tight leading-[1.1] mb-4">
            Проекты, которые приносят результат
          </h2>
          <p className="text-base sm:text-lg text-[#525252] font-normal leading-relaxed">
            Реальные рекламные кампании на радио, магистральных щитах и в полиграфии для бизнеса в Балаково и Поволжье.
          </p>
        </div>

        {/* Стек карточек проектов с наслоением при скролле */}
        <div className="flex flex-col gap-12 sm:gap-16 pb-16">
          {PROJECTS.map((project, index) => (
            <WorkCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
