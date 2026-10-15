"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import SafeImage from "@/app/components/ui/SafeImage";
import { radioAudio } from "@/lib/audio/radio-audio";
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

const EQUALIZER_BARS = [
  { base: 35, speed: 0.52, delay: 0.05 },
  { base: 65, speed: 0.42, delay: 0.12 },
  { base: 90, speed: 0.60, delay: 0.22 },
  { base: 45, speed: 0.38, delay: 0.08 },
  { base: 100, speed: 0.55, delay: 0.18 },
  { base: 70, speed: 0.45, delay: 0.28 },
  { base: 40, speed: 0.62, delay: 0.02 },
  { base: 85, speed: 0.48, delay: 0.15 },
  { base: 30, speed: 0.58, delay: 0.25 },
  { base: 95, speed: 0.40, delay: 0.10 },
  { base: 60, speed: 0.50, delay: 0.20 },
  { base: 100, speed: 0.65, delay: 0.30 },
  { base: 50, speed: 0.35, delay: 0.04 },
  { base: 80, speed: 0.52, delay: 0.14 },
  { base: 35, speed: 0.44, delay: 0.24 },
  { base: 75, speed: 0.58, delay: 0.07 },
  { base: 90, speed: 0.42, delay: 0.17 },
  { base: 55, speed: 0.60, delay: 0.27 },
  { base: 100, speed: 0.46, delay: 0.03 },
  { base: 70, speed: 0.54, delay: 0.13 },
  { base: 40, speed: 0.39, delay: 0.23 },
  { base: 85, speed: 0.62, delay: 0.09 },
  { base: 30, speed: 0.47, delay: 0.19 },
  { base: 95, speed: 0.53, delay: 0.29 },
  { base: 65, speed: 0.41, delay: 0.06 },
  { base: 45, speed: 0.57, delay: 0.16 },
  { base: 80, speed: 0.49, delay: 0.26 },
  { base: 35, speed: 0.63, delay: 0.01 },
  { base: 90, speed: 0.45, delay: 0.11 },
  { base: 60, speed: 0.55, delay: 0.21 },
  { base: 40, speed: 0.37, delay: 0.31 },
  { base: 25, speed: 0.50, delay: 0.05 },
];

const SoundwaveEqualizer = memo(function SoundwaveEqualizer({
  isPlaying,
  isTuning,
}: {
  isPlaying: boolean;
  isTuning: boolean;
}) {
  return (
    <div className="w-full flex items-center justify-between gap-[2px] sm:gap-1 h-6 sm:h-8 pt-1 border-t border-white/10 overflow-hidden">
      {EQUALIZER_BARS.map((bar, idx) => {
        let style: React.CSSProperties = {
          height: `${Math.max(14, bar.base * 0.22)}%`,
          transformOrigin: "center",
          transition: "height 0.25s ease, opacity 0.25s ease, background-color 0.25s ease",
        };
        let className = "flex-1 rounded-full bg-white/25";

        if (isTuning) {
          style = {
            height: "100%",
            transformOrigin: "center",
            animation: `eq-noise-jitter ${0.12 + (idx % 4) * 0.04}s ease-in-out infinite alternate`,
            animationDelay: `${(idx * 0.015).toFixed(3)}s`,
          };
          className = "flex-1 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]";
        } else if (isPlaying) {
          style = {
            height: "100%",
            transformOrigin: "center",
            animation: `eq-live-wave ${bar.speed}s ease-in-out infinite alternate`,
            animationDelay: `${bar.delay}s`,
          };
          className = "flex-1 rounded-full bg-[#E22A2A] shadow-[0_0_8px_rgba(226,42,42,0.6)]";
        }

        return <div key={idx} className={className} style={style} />;
      })}
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
  isTuning,
  onPlayToggle,
}: {
  project: WorkProjectItem;
  index: number;
  activeAudioId: string | null;
  isTuning: boolean;
  onPlayToggle: (id: string, audioSrc: string) => void;
}) {
  const stickyTop = `calc(90px + ${index * 24}px)`;
  const isThisTrack = activeAudioId === project.id;
  const isTuningThis = isThisTrack && isTuning;
  const isPlaying = isThisTrack && !isTuning;

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
              {/* Чистый заголовок проекта */}
              <h3 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-[50px] font-extrabold text-[#0A0A0A] tracking-tight leading-tight mb-3 sm:mb-4">
                {project.title}
              </h3>

              {/* Описание */}
              <p className="text-sm sm:text-base 2xl:text-lg text-[#525252] leading-relaxed mb-5 lg:mb-6 font-normal">
                {project.description}
              </p>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 mb-3 sm:mb-4" />

              {/* Строка: Клиент */}
              <div className="flex items-start justify-between py-1.5 gap-3">
                <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider shrink-0 pt-0.5">
                  Клиент:
                </span>
                <span className="text-sm sm:text-base 2xl:text-lg font-bold text-[#0A0A0A] text-right">
                  {project.client}
                </span>
              </div>

              <div className="w-full h-px bg-[#D4D4D4]/70 my-2.5 sm:my-3" />

              {/* Строка: Звёздный диктор с монументальным акцентом Дэдпула */}
              {project.celebrityVoice && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider shrink-0">
                      Диктор:
                    </span>
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-start sm:justify-end">
                      <span className="text-base sm:text-lg 2xl:text-xl font-black text-[#0A0A0A]">
                        {project.celebrityVoice}
                      </span>
                      {project.celebrityBadge && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#E22A2A]/10 border border-[#E22A2A]/30 text-[#C11212] text-xs sm:text-sm font-extrabold tracking-wide shadow-sm shrink-0">
                          <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                          </svg>
                          <span>{project.celebrityBadge}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-px bg-[#D4D4D4]/70 my-2.5 sm:my-3" />
                </>
              )}

              {/* Строка: Ротация на радио */}
              {project.radioStation && (
                <>
                  <div className="flex items-start justify-between py-1.5 gap-3">
                    <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider shrink-0 pt-0.5">
                      Радиоэфир:
                    </span>
                    <span className="text-sm sm:text-base 2xl:text-lg font-bold text-[#0A0A0A] text-right">
                      {project.radioStation}
                    </span>
                  </div>
                  <div className="w-full h-px bg-[#D4D4D4]/70 my-2.5 sm:my-3" />
                </>
              )}

              {/* Строка: Услуги */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 mb-6 sm:mb-8 gap-2">
                <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-[#737373] uppercase tracking-wider shrink-0">
                  Услуги:
                </span>
                <div className="flex flex-wrap items-center justify-start sm:justify-end gap-1.5 sm:gap-2">
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

          {/* Правая колонка: Фоновое изображение со сдвинутым вниз компактным плеером */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative w-full aspect-[3/4] xs:aspect-[4/5] sm:aspect-[4/3] lg:aspect-[1184/1080] min-h-[460px] xs:min-h-[500px] sm:min-h-0 rounded-[18px] sm:rounded-[24px] 2xl:rounded-[32px] overflow-hidden border border-black/10 bg-[#141210] p-3 sm:p-6 2xl:p-8 flex flex-col justify-between text-white shadow-2xl group select-none">
              
              {/* Слой фонового изображения кейса (когда картинка задана) */}
              {project.imageSrc && (
                <SafeImage
                  src={project.imageSrc}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (min-width: 1536px) 760px, 580px"
                  className="object-cover object-[center_35%] sm:object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}

              {/* Слот-плейсхолдер под картинку: свободное пространство готово под арт */}
              {!project.imageSrc && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B18] via-[#141210] to-[#0A0908] flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-dashed border-white/20 flex items-center justify-center mb-3 text-white/30">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/40">
                    Место под фоновое изображение
                  </span>
                </div>
              )}


              {/* Верхняя строка: Компактный бейдж статуса эфира и хронометраж с фиксированной высотой и без переносов */}
              <div className="relative z-10 flex items-center justify-between gap-2 w-full">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 h-7 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                  <span className="relative flex h-2 w-2 shrink-0">
                    {(isPlaying || isTuningThis) && (
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isTuningThis ? "bg-amber-400" : "bg-red-500"
                        }`}
                      />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isTuningThis
                          ? "bg-amber-400 animate-pulse"
                          : isPlaying
                          ? "bg-red-500"
                          : "bg-neutral-400"
                      }`}
                    />
                  </span>
                  <span
                    className={
                      isTuningThis
                        ? "text-amber-300 font-extrabold"
                        : isPlaying
                        ? "text-red-400 font-extrabold"
                        : "text-white/90"
                    }
                  >
                    {isTuningThis ? "99.2 FM · Поиск..." : isPlaying ? "99.2 FM · В эфире" : "99.2 FM"}
                  </span>
                  <span className="hidden sm:inline text-white/40 font-normal">|</span>
                  <span className="hidden sm:inline text-white/80">Аудиокейс</span>
                </div>

                <div className="inline-flex items-center px-2.5 sm:px-3 h-7 sm:h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono font-medium text-white/80 tracking-wider whitespace-nowrap shrink-0">
                  <span className="sm:hidden">25 сек</span>
                  <span className="hidden sm:inline">{project.audioFormat || "Эфирный ролик · 25 сек"}</span>
                </div>
              </div>

              {/* Центральная часть: ПОЛНОСТЬЮ ОТКРЫТА, чтобы фоновую картинку было отлично видно */}
              <div className="flex-1 min-h-[200px]" />

              {/* Нижняя часть: Сдвинутый вниз компактный плеер с центрированной кнопкой и живым эквалайзером */}
              <div className="relative z-10 w-full p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col gap-2 sm:gap-2.5">
                <div className="flex items-center gap-2.5 sm:gap-4">
                  {/* Строго центрированная кнопка Play/Pause */}
                  <button
                    type="button"
                    onClick={() => onPlayToggle(project.id, project.audioSrc || "/sounds/truboplast-deadpool-glanz.mp3")}
                    aria-label={isPlaying ? "Поставить на паузу" : "Слушать ролик с Петром Гланцем"}
                    className={`shrink-0 relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer ${
                      isTuningThis
                        ? "bg-amber-400 text-black shadow-amber-400/40 animate-pulse"
                        : isPlaying
                        ? "bg-[#E22A2A] text-white shadow-[#E22A2A]/50 scale-105"
                        : "bg-white text-[#0A0A0A] hover:bg-[#E22A2A] hover:text-white"
                    }`}
                  >
                    {isPlaying || isTuningThis ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Текстовая плашка диктора и статус */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                      {project.celebrityVoice || "Пётр Гланц"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate mt-0.5">
                      {isTuningThis
                        ? "Поиск частоты 99.2 FM..."
                        : isPlaying
                        ? "В эфире «Дорожного Радио»"
                        : "Нажмите для прослушивания"}
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] sm:text-[11px] font-mono font-medium text-white/50 px-1.5 sm:px-2 py-0.5 rounded bg-white/10">
                    25 сек
                  </span>
                </div>

                {/* Полноценный анимированный эквалайзер внутри черного окошка */}
                <SoundwaveEqualizer isPlaying={isPlaying} isTuning={isTuningThis} />
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

const DUMMY_TITLES = new Set(["alongside", "hypertech", "redefine flow", "recap"]);
const DUMMY_CLIENTS = new Set(["lumina legal", "fitfuel nutrition", "verge consulting", "harbor financial"]);

function isDummySample(item: WorkProjectItem) {
  const t = (item.title || "").toLowerCase().trim();
  const c = (item.client || "").toLowerCase().trim();
  return DUMMY_TITLES.has(t) || DUMMY_CLIENTS.has(c);
}

export default function Work({ initialData }: WorkProps) {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isTuning, setIsTuning] = useState(false);
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
      const audio = audioRef.current;
      if (!audio) return;

      // Если кликнули по тому же треку, который сейчас играет или настраивается -> Пауза
      if (activeAudioId === id) {
        audio.pause();
        setActiveAudioId(null);
        setIsTuning(false);
        return;
      }

      // Если играл другой трек, ставим его на паузу
      audio.pause();
      setActiveAudioId(id);
      setIsTuning(true);

      // Запускаем аутентичное шипение эфира и захват волны перед воспроизведением
      radioAudio.playTuningIntro(() => {
        // Проверяем, не нажал ли пользователь паузу за время настройки
        setActiveAudioId((currentId) => {
          if (currentId !== id) {
            setIsTuning(false);
            return currentId;
          }

          setIsTuning(false);
          if (!audio.src.endsWith(audioSrc)) {
            audio.src = audioSrc;
          }

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              if (err.name !== "AbortError") {
                console.error("Audio play error:", err);
              }
              setActiveAudioId(null);
            });
          }
          return id;
        });
      });
    },
    [activeAudioId]
  );

  // Очищаем старые демонстрационные шаблоны, оставляя только реальные проекты студии
  const rawItems =
    initialData?.items && Array.isArray(initialData.items) && initialData.items.length > 0
      ? initialData.items.filter((item) => !isDummySample(item))
      : [];

  const items = rawItems.length > 0 ? rawItems : DEFAULT_WORK_DATA.items;

  return (
    <section id="work" className="w-full bg-[#F3EFE8] pt-14 sm:pt-20 2xl:pt-24 pb-8 sm:pb-12 lg:pb-14 px-4 sm:px-8 lg:px-10 2xl:px-12">
      {/* Скрытый аудиоплеер для надежного воспроизведения без утечек памяти */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={() => {
          setActiveAudioId(null);
          setIsTuning(false);
        }}
        onError={() => {
          setActiveAudioId(null);
          setIsTuning(false);
        }}
      />

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
                  imageSrc: project.imageSrc !== undefined ? project.imageSrc : ((project as { image?: string }).image || ""),
                }}
                index={index}
                activeAudioId={activeAudioId}
                isTuning={isTuning}
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

