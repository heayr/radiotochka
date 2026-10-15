"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import SafeImage from "@/app/components/ui/SafeImage";
import {
  DEFAULT_WORK_DATA,
  type WorkProjectItem,
  type WorkSectionData,
} from "@/types/site-content";

/**
 * Стандартная карточка визуального проекта (изображение кейса)
 */
const WorkVisualCard = memo(function WorkVisualCard({
  project,
  index,
}: {
  project: WorkProjectItem;
  index: number;
}) {
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
              <div className="flex flex-col xs:flex-row xs:items-center justify-between py-1 mb-6 sm:mb-8 2xl:mb-10 gap-2">
                <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider shrink-0">
                  Услуги:
                </span>
                <div className="flex flex-wrap items-center justify-start xs:justify-end gap-1.5 sm:gap-2 2xl:gap-2.5">
                  {(Array.isArray(project.services) ? project.services : []).map((service, sIdx) => (
                    <span
                      key={`${service}-${sIdx}`}
                      className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 2xl:px-4 2xl:py-2 rounded-full bg-[#EAE0CF]/50 text-[#0A0A0A] text-[11px] sm:text-xs 2xl:text-sm font-semibold border border-[#D4C8B5]/60"
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
                src={project.imageSrc || (project as { image?: string }).image || "/images/work/project-01.png"}
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

/**
 * Шаблон карточки для аудио-проектов (радиоролик, звёздный дубляж, джингл)
 */
const WorkAudioCard = memo(function WorkAudioCard({
  project,
  index,
  activeAudioId,
  onPlayToggle,
}: {
  project: WorkProjectItem;
  index: number;
  activeAudioId: string | null;
  onPlayToggle: (id: string, audioSrc: string) => void;
}) {
  const stickyTop = `calc(90px + ${index * 24}px)`;
  const isPlaying = activeAudioId === project.id;

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
      <div className="w-full bg-[#FBFAF9] rounded-[24px] sm:rounded-[36px] 2xl:rounded-[44px] border-2 border-[#E5DFD5] p-5 sm:p-10 lg:p-12 2xl:p-16 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(226,42,42,0.08)] transition-all duration-500 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
          
          {/* Левая колонка: Описание кейса со звёздным голосом */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between order-2 lg:order-1">
            <div>
              {/* Бейдж звёздного диктора */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#E22A2A]/10 border border-[#E22A2A]/30 text-[#C11212] text-xs sm:text-sm font-extrabold tracking-wide mb-3 sm:mb-4 shadow-sm">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
                <span>{project.celebrityBadge || "Звёздный голос в эфире"}</span>
              </div>

              {/* Заголовок проекта */}
              <h3 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-[50px] font-extrabold text-[#0A0A0A] tracking-tight leading-tight mb-3 sm:mb-4">
                {project.title}
              </h3>

              {/* Цитата / Слоган ролика */}
              {project.tagline && (
                <div className="relative mb-4 sm:mb-5 p-3.5 sm:p-4 rounded-2xl bg-black/[0.03] border border-black/[0.06]">
                  <p className="text-xs sm:text-sm 2xl:text-base font-semibold italic text-[#1A1A1A] leading-relaxed">
                    {project.tagline}
                  </p>
                </div>
              )}

              {/* Описание */}
              <p className="text-sm sm:text-base 2xl:text-lg text-[#525252] leading-relaxed mb-5 lg:mb-6 font-normal">
                {project.description}
              </p>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 mb-3 sm:mb-4" />

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
              <div className="w-full h-px bg-[#D4D4D4]/70 my-2.5 sm:my-3" />

              {/* Строка: Ротация на радио */}
              {project.radioStation && (
                <>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider">
                      Радиоэфир:
                    </span>
                    <span className="text-sm sm:text-base 2xl:text-lg font-bold text-[#0A0A0A]">
                      {project.radioStation}
                    </span>
                  </div>
                  <div className="w-full h-px bg-[#D4D4D4]/70 my-2.5 sm:my-3" />
                </>
              )}

              {/* Строка: Услуги */}
              <div className="flex flex-col xs:flex-row xs:items-center justify-between py-1 mb-6 sm:mb-8 gap-2">
                <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider shrink-0">
                  Услуги:
                </span>
                <div className="flex flex-wrap items-center justify-start xs:justify-end gap-1.5 sm:gap-2">
                  {(Array.isArray(project.services) ? project.services : []).map((service, sIdx) => (
                    <span
                      key={`${service}-${sIdx}`}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#EAE0CF]/50 text-[#0A0A0A] text-[11px] sm:text-xs font-semibold border border-[#D4C8B5]/60"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Кнопка заказа ролика */}
            <div>
              <Link
                href={project.href || "#contact"}
                className="group inline-flex items-center justify-center w-full sm:w-auto gap-2.5 px-6 2xl:px-8 py-3.5 2xl:py-4 rounded-full bg-[#0A0A0A] hover:bg-[#E22A2A] text-white font-semibold text-sm 2xl:text-base transition-all duration-200 shadow-md hover:shadow-xl active:scale-[0.98]"
              >
                <span>Заказать аудиоролик с диктором</span>
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

          {/* Правая колонка: Интерактивная аудио-дека ролика */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[1184/1080] rounded-[18px] sm:rounded-[24px] 2xl:rounded-[32px] overflow-hidden border border-black/10 bg-gradient-to-br from-[#1E1B18] via-[#141210] to-[#0A0908] p-5 sm:p-8 2xl:p-10 flex flex-col justify-between text-white shadow-2xl group select-none">
              
              {/* Фоновые неоновые световые акценты темы Дэдпула */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#E22A2A]/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-brand-pink/15 blur-3xl pointer-events-none" />

              {/* Верхняя строка студийной деки */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    {isPlaying && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isPlaying ? "bg-red-500" : "bg-neutral-500"
                      }`}
                    />
                  </span>
                  <span className={isPlaying ? "text-red-400 font-extrabold" : "text-white/70"}>
                    {isPlaying ? "В эфире" : "FM Аудиокейс"}
                  </span>
                </div>

                <span className="text-[11px] sm:text-xs font-mono font-medium text-white/50 tracking-wider">
                  {project.audioFormat || "Эфирный ролик · 25 сек"}
                </span>
              </div>

              {/* Центр деки: Кнопка Play/Pause и статус голоса */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
                <button
                  type="button"
                  onClick={() => onPlayToggle(project.id, project.audioSrc || "/sounds/truboplast-deadpool-glanz.mp3")}
                  aria-label={isPlaying ? "Поставить на паузу" : "Слушать ролик с Петром Гланцем"}
                  className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 2xl:w-28 2xl:h-28 rounded-full transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer ${
                    isPlaying
                      ? "bg-[#E22A2A] text-white shadow-[#E22A2A]/50 scale-105"
                      : "bg-white text-[#0A0A0A] hover:bg-[#E22A2A] hover:text-white hover:scale-105 shadow-white/20"
                  }`}
                >
                  {/* Пульсирующее кольцо при воспроизведении */}
                  {isPlaying && (
                    <span className="absolute inset-0 rounded-full border-2 border-[#E22A2A] animate-ping opacity-40 pointer-events-none" />
                  )}
                  {isPlaying ? (
                    <svg className="w-8 h-8 2xl:w-10 2xl:h-10 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 2xl:w-10 2xl:h-10 fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Имя диктора под кнопкой */}
                <div className="text-center mt-4 sm:mt-5">
                  <p className="text-base sm:text-lg 2xl:text-xl font-black text-white tracking-tight">
                    {project.celebrityVoice || "Пётр Иващенко (Пётр Гланц)"}
                  </p>
                  <p className="text-xs sm:text-sm text-white/50 font-medium mt-0.5">
                    {isPlaying ? "Звучит в динамиках — оцените подачу" : "Нажмите для прослушивания радиоролика"}
                  </p>
                </div>
              </div>

              {/* Нижняя часть деки: Анимированный эквалайзер */}
              <div className="relative z-10 pt-2">
                <div className="flex items-center gap-1 sm:gap-1.5 h-6 mb-2">
                  {[20, 35, 60, 95, 45, 80, 100, 50, 75, 30, 90, 65, 40, 85, 30, 60, 95, 50, 70, 30, 85, 45].map(
                    (baseHeight, bIdx) => (
                      <div
                        key={bIdx}
                        className={`flex-1 rounded-full transition-all duration-150 ${
                          isPlaying ? "bg-[#E22A2A]" : "bg-white/20"
                        }`}
                        style={{
                          height: isPlaying
                            ? `${Math.max(20, Math.sin(Date.now() / 120 + bIdx) * 35 + baseHeight * 0.6)}%`
                            : `${Math.max(15, baseHeight * 0.3)}%`,
                        }}
                      />
                    )
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-white/40">
                  <span>Официальный саундтрек ролика</span>
                  <span>Балаково · 105.5 FM</span>
                </div>
              </div>

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
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Очистка аудио при размонтировании секции
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleAudioToggle = useCallback(
    (id: string, audioSrc: string) => {
      if (activeAudioId === id && audioRef.current) {
        if (!audioRef.current.paused) {
          audioRef.current.pause();
          setActiveAudioId(null);
        } else {
          audioRef.current.play().catch(() => {});
          setActiveAudioId(id);
        }
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      setActiveAudioId(id);

      audio.addEventListener("ended", () => {
        setActiveAudioId(null);
      });

      audio.play().catch(() => {
        setActiveAudioId(null);
      });
    },
    [activeAudioId]
  );

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

        {/* Стек карточек проектов с динамическим выбором шаблона (Visual / Audio) */}
        <div className="flex flex-col gap-8 sm:gap-16 pb-2 sm:pb-4">
          {items.map((project, index) => {
            const isAudioProject = project.projectType === "audio" || Boolean(project.audioSrc);

            return isAudioProject ? (
              <WorkAudioCard
                key={project.id || index}
                project={{
                  ...project,
                  services: Array.isArray(project.services) ? project.services : [],
                  imageSrc: project.imageSrc || (project as { image?: string }).image || "/images/work/project-02.png",
                }}
                index={index}
                activeAudioId={activeAudioId}
                onPlayToggle={handleAudioToggle}
              />
            ) : (
              <WorkVisualCard
                key={project.id || index}
                project={{
                  ...project,
                  services: Array.isArray(project.services) ? project.services : [],
                  imageSrc: project.imageSrc || (project as { image?: string }).image || "/images/work/project-01.png",
                }}
                index={index}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}

