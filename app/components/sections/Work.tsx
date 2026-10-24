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
  const stickyTop = `calc(clamp(64px, 7.5vh, 88px) + ${index * 16}px)`;

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
      <div className="w-full bg-[#FBFAF9] rounded-[20px] sm:rounded-[30px] 2xl:rounded-[40px] border border-[#E5DFD5] p-4 xs:p-5 sm:p-7 md:p-8 lg:p-7 xl:p-9 2xl:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] transition-shadow duration-500 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-7 lg:gap-8 xl:gap-12 2xl:gap-16">
          
          {/* Левая колонка: Текстовый контент и метаданные проекта */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between order-2 lg:order-1">
            <div>
              {/* Заголовок проекта */}
              <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-[30px] xl:text-[38px] 2xl:text-[46px] font-extrabold text-[#0A0A0A] tracking-tight leading-[1.15] mb-2 sm:mb-3 2xl:mb-5">
                {project.title}
              </h3>

              {/* Описание */}
              <p className="text-xs sm:text-sm lg:text-[13px] xl:text-base 2xl:text-lg text-[#525252] leading-relaxed mb-3 sm:mb-4 lg:mb-4 xl:mb-6 font-normal">
                {project.description}
              </p>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 mb-2 sm:mb-3 2xl:mb-4" />

              {/* Строка: Клиент */}
              <div className="flex items-center justify-between py-1">
                <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-[#737373] uppercase tracking-wider">
                  Клиент:
                </span>
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <span className="text-xs sm:text-sm lg:text-[13px] xl:text-base 2xl:text-lg font-bold text-[#0A0A0A]">
                    {project.client}
                  </span>
                  {Boolean(project.clientUrl) && (
                    <a
                      href={project.clientUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 hover:bg-[#E22A2A] text-[#404040] hover:text-white text-[11px] sm:text-xs font-semibold transition-all duration-200 border border-black/10 hover:border-transparent group/link shadow-sm active:scale-95"
                      title={`Перейти на сайт ${project.client}`}
                    >
                      <span>Сайт клиента</span>
                      <svg
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Разделитель */}
              <div className="w-full h-px bg-[#D4D4D4]/70 my-2 sm:my-2.5 2xl:my-3" />

              {/* Строка: Услуги */}
              <div className="flex flex-col xs:flex-row xs:items-center justify-between py-1 mb-4 sm:mb-5 lg:mb-5 xl:mb-7 gap-2">
                <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-[#737373] uppercase tracking-wider shrink-0">
                  Услуги:
                </span>
                <div className="flex flex-wrap items-center justify-start xs:justify-end gap-1.5 sm:gap-2">
                  {(Array.isArray(project.services) ? project.services : []).map((service, sIdx) => (
                    <span
                      key={`${service}-${sIdx}`}
                      className="px-2.5 py-0.5 sm:px-3 sm:py-1 2xl:px-3.5 2xl:py-1.5 rounded-full bg-[#EAE0CF]/50 text-[#0A0A0A] text-[10px] sm:text-xs 2xl:text-sm font-semibold border border-[#D4C8B5]/60"
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
                className="group inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-2.5 sm:px-6 sm:py-3 xl:px-7 xl:py-3.5 2xl:px-8 2xl:py-4 rounded-full bg-[#0A0A0A] hover:bg-brand-pink text-white font-semibold text-xs sm:text-sm 2xl:text-base transition-all duration-200 shadow-md hover:shadow-xl active:scale-[0.98]"
              >
                <span>Обсудить похожий проект</span>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/11] xl:aspect-[16/10] rounded-[16px] sm:rounded-[22px] 2xl:rounded-[28px] overflow-hidden bg-[#EFECE6] group shadow-inner">
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

function formatAudioTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const SoundwaveEqualizer = memo(function SoundwaveEqualizer({
  isPlaying,
  isTuning,
  progress = 0,
  onSeek,
}: {
  isPlaying: boolean;
  isTuning: boolean;
  progress?: number;
  onSeek?: (percent: number) => void;
}) {
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percent);
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = touch.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percent);
  };

  const activeBars = Math.round(progress * EQUALIZER_BARS.length);

  return (
    <div
      onClick={handleSeek}
      onTouchStart={handleTouch}
      role="slider"
      aria-label="Перемотка аудиоролика"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      className="group/eq w-full flex items-center py-1.5 cursor-pointer select-none focus:outline-none"
    >
      <div className="w-full flex items-center justify-between gap-[2px] sm:gap-1 lg:gap-[3px] h-7 sm:h-8 lg:h-10">
        {EQUALIZER_BARS.map((bar, idx) => {
          const isPassed = idx < activeBars;
          let style: React.CSSProperties = {
            height: `${Math.max(16, bar.base * 0.24)}%`,
            transformOrigin: "center",
            transition: "height 0.25s ease, opacity 0.25s ease, background-color 0.2s ease",
          };
          let className = isPassed ? "flex-1 rounded-full bg-[#E22A2A]/85" : "flex-1 rounded-full bg-white/20";

          if (isTuning) {
            style = {
              height: "100%",
              transformOrigin: "center",
              animation: `eq-noise-jitter ${0.12 + (idx % 4) * 0.04}s ease-in-out infinite alternate`,
              animationDelay: `${(idx * 0.015).toFixed(3)}s`,
            };
            className = "flex-1 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]";
          } else if (isPlaying) {
            // Весь эквалайзер активен и шевелится в такт звуку:
            // Пройденная зона — ярко-красная
            // Недоигранная зона — белая/полупрозрачная, но ТОЖЕ анимированная!
            style = {
              height: "100%",
              transformOrigin: "center",
              animation: `eq-live-wave ${bar.speed}s ease-in-out infinite alternate`,
              animationDelay: `${bar.delay}s`,
            };
            className = isPassed
              ? "flex-1 rounded-full bg-[#E22A2A] shadow-[0_0_8px_rgba(226,42,42,0.7)]"
              : "flex-1 rounded-full bg-white/35 group-hover/eq:bg-white/50";
          }

          return <div key={idx} className={className} style={style} />;
        })}
      </div>
    </div>
  );
});

class AudioProgressManager {
  private listeners = new Set<(time: number, duration: number) => void>();
  private _currentTime = 0;
  private _duration = 25;

  subscribe(callback: (time: number, duration: number) => void) {
    this.listeners.add(callback);
    callback(this._currentTime, this._duration);
    return () => {
      this.listeners.delete(callback);
    };
  }

  update(time: number, duration: number) {
    this._currentTime = time;
    this._duration = duration;
    this.listeners.forEach((cb) => cb(time, duration));
  }

  reset() {
    this._currentTime = 0;
    this.listeners.forEach((cb) => cb(0, this._duration));
  }
}

const audioProgressManager = new AudioProgressManager();

/**
 * Изолированный компонент отображения времени (без перерисовки родительской карточки)
 */
const AudioDockTime = memo(function AudioDockTime({
  isPlaying,
  isThisTrack,
}: {
  isPlaying: boolean;
  isThisTrack: boolean;
}) {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    return audioProgressManager.subscribe((t, d) => {
      setTime(t);
      if (d > 0) setDuration(d);
    });
  }, []);

  return (
    <div className="shrink-0 flex items-center gap-1 text-[11px] sm:text-xs lg:text-sm font-mono font-medium tracking-tight tabular-nums select-none">
      <span className={isPlaying && isThisTrack ? "text-[#FF4D4D] font-bold" : "text-white/90"}>
        {formatAudioTime(isThisTrack ? time : 0)}
      </span>
      <span className="text-white/30">/</span>
      <span className="text-white/60">
        {formatAudioTime(isThisTrack && duration > 0 ? duration : 25)}
      </span>
    </div>
  );
});

/**
 * Изолированный компонент эквалайзера (получает прогресс напрямую из AudioProgressManager)
 */
const AudioDockEqualizer = memo(function AudioDockEqualizer({
  isPlaying,
  isTuning,
  isThisTrack,
  onSeek,
}: {
  isPlaying: boolean;
  isTuning: boolean;
  isThisTrack: boolean;
  onSeek: (percent: number) => void;
}) {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    return audioProgressManager.subscribe((t, d) => {
      setTime(t);
      if (d > 0) setDuration(d);
    });
  }, []);

  const progress = isThisTrack && duration > 0 ? time / duration : 0;

  return (
    <SoundwaveEqualizer
      isPlaying={isPlaying}
      isTuning={isTuning}
      progress={progress}
      onSeek={onSeek}
    />
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
  onSeek,
}: {
  project: WorkProjectItem;
  index: number;
  activeAudioId: string | null;
  isTuning: boolean;
  onPlayToggle: (id: string, audioSrc: string) => void;
  onSeek: (percent: number) => void;
}) {
  const stickyTop = `calc(clamp(64px, 7.5vh, 88px) + ${index * 16}px)`;
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
      <div className="w-full bg-[#FBFAF9] rounded-[20px] sm:rounded-[30px] 2xl:rounded-[40px] border-2 border-[#E5DFD5] p-4 xs:p-5 sm:p-7 md:p-8 lg:p-7 xl:p-9 2xl:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(226,42,42,0.08)] transition-all duration-500 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-stretch items-center gap-5 sm:gap-7 lg:gap-8 xl:gap-12 2xl:gap-16">
          
          {/* Левая колонка: Описание кейса со звёздным голосом */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between order-2 lg:order-1 py-1">
            <div>
              {/* Редакционный Kicker — только рубрика, без дублирования клиента из заголовка */}
              <p className="text-[10px] sm:text-xs lg:text-xs font-bold tracking-[0.2em] text-[#8C8C8C] uppercase mb-1.5 lg:mb-2">
                Кейс · Радиореклама
              </p>

              {/* Заголовок проекта */}
              <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-[30px] xl:text-[38px] 2xl:text-[46px] font-extrabold text-[#0A0A0A] tracking-tight leading-[1.15] mb-2 sm:mb-3 lg:mb-3.5">
                {project.title}
              </h3>

              {/* Живой рассказ — упоминает Гланца и Дэдпула единственный раз через project.description */}
              <p className="text-xs sm:text-sm lg:text-[13px] xl:text-base 2xl:text-lg text-[#525252] leading-relaxed mb-3 sm:mb-4 lg:mb-4 font-normal">
                {project.description}
              </p>

              {/* Журнальная выноска (Pull-quote) — только имя и бейдж, без повторов */}
              {project.celebrityVoice && (
                <div className="relative pl-3 sm:pl-3.5 lg:pl-4 border-l-[3px] border-[#E22A2A] mb-3 sm:mb-4 lg:mb-4 lg:py-0.5">
                  <p className="text-base sm:text-lg lg:text-xl xl:text-[22px] font-black text-[#0A0A0A] tracking-tight leading-snug">
                    {project.celebrityVoice}
                  </p>
                  {project.celebrityBadge && (
                    <p className="text-[11px] sm:text-xs lg:text-sm font-semibold text-[#E22A2A] mt-0.5 tracking-tight">
                      {project.celebrityBadge}
                    </p>
                  )}
                </div>
              )}

              {/* Выходные данные кейса (Editorial Colophon) */}
              <div className="border-t border-b border-[#D4D4D4]/70 py-2 sm:py-2.5 lg:py-3 mb-3.5 sm:mb-4 lg:mb-5 space-y-1.5 sm:space-y-2 lg:space-y-2.5">
                {/* Клиент — здесь единственное место, где указан полный бренд */}
                {project.client && (
                  <div className="flex items-baseline gap-2.5 sm:gap-4 lg:gap-5 text-xs sm:text-sm lg:text-[13px] xl:text-base">
                    <span className="text-[10px] sm:text-xs lg:text-xs font-bold text-[#8C8C8C] uppercase tracking-wider shrink-0 w-[4.2rem] sm:w-16 lg:w-20 xl:w-24">
                      Клиент
                    </span>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <span className="font-semibold text-[#0A0A0A] leading-snug">
                        {project.client}
                      </span>
                      {Boolean(project.clientUrl) && (
                        <a
                          href={project.clientUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/5 hover:bg-[#E22A2A] text-[#404040] hover:text-white text-[11px] sm:text-xs font-semibold transition-all duration-200 border border-black/10 hover:border-transparent group/link shadow-sm active:scale-95"
                          title={`Перейти на сайт ${project.client}`}
                        >
                          <span>Сайт клиента</span>
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {project.radioStation && (
                  <div className="flex items-baseline gap-2.5 sm:gap-4 lg:gap-5 text-xs sm:text-sm lg:text-[13px] xl:text-base">
                    <span className="text-[10px] sm:text-xs lg:text-xs font-bold text-[#8C8C8C] uppercase tracking-wider shrink-0 w-[4.2rem] sm:w-16 lg:w-20 xl:w-24">
                      Эфир
                    </span>
                    <span className="font-medium text-[#0A0A0A] leading-snug">
                      {project.radioStation.split("·").map((st) => {
                        const station = st.trim();
                        const freq = station.toLowerCase().includes("дорожное") ? "99.2 FM" : "98.8 FM";
                        return `${station} (${freq})`;
                      }).join(" · ")}
                    </span>
                  </div>
                )}

                {Array.isArray(project.services) && project.services.length > 0 && (
                  <div className="flex items-baseline gap-2.5 sm:gap-4 lg:gap-5 text-xs sm:text-sm lg:text-[13px] xl:text-base">
                    <span className="text-[10px] sm:text-xs lg:text-xs font-bold text-[#8C8C8C] uppercase tracking-wider shrink-0 w-[4.2rem] sm:w-16 lg:w-20 xl:w-24">
                      Формат
                    </span>
                    <span className="font-medium text-[#525252] leading-snug">
                      {project.services.join(" · ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Кнопка заказа ролика */}
            <div>
              <Link
                href={project.href || "#contact"}
                className="group inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-2.5 sm:px-6 sm:py-3 xl:px-7 xl:py-3.5 2xl:px-8 2xl:py-4 rounded-full bg-[#0A0A0A] hover:bg-[#E22A2A] text-white font-semibold text-xs sm:text-sm 2xl:text-base transition-all duration-200 shadow-md hover:shadow-xl active:scale-[0.98]"
              >
                <span>Заказать аудиоролик с диктором</span>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
          <div className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col">
            <div className="relative w-full h-full aspect-[16/10] xs:aspect-[16/11] sm:aspect-[16/10] lg:aspect-auto min-h-[290px] xs:min-h-[310px] sm:min-h-[340px] lg:min-h-0 rounded-[16px] sm:rounded-[22px] 2xl:rounded-[28px] overflow-hidden bg-[#141210] p-3 sm:p-4 lg:p-5 2xl:p-6 flex flex-col justify-between text-white shadow-2xl group select-none">
              
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

              {/* Верхняя строка: Обе радиостанции 99.2 FM и 98.8 FM размещены от левого края */}
              <div className="relative z-10 flex items-center justify-start gap-2 lg:gap-2.5 w-full flex-wrap">
                {/* Станция 1: 99.2 FM («Дорожное Радио») */}
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 lg:px-3.5 h-6 sm:h-7 lg:h-7.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
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
                  <span className="text-white/40 font-normal">|</span>
                  <span className="text-white/80 font-normal">Дорожное</span>
                </div>

                {/* Станция 2: 98.8 FM («НАШЕ Радио») */}
                <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 h-6 sm:h-7 lg:h-7.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E22A2A]/70 shrink-0" />
                  <span>98.8 FM</span>
                  <span className="text-white/40 font-normal">|</span>
                  <span className="text-white/80 font-normal">НАШЕ</span>
                </div>
              </div>

              {/* Центральная часть: сбалансированная распорка под арт */}
              <div className="flex-1 min-h-[24px] xs:min-h-[40px] sm:min-h-[50px] lg:min-h-[40px]" />

              {/* Нижняя часть: Сдвинутый вниз компактный плеер с затемнённым стеклом, живым таймером и эквалайзером */}
              <div className="relative z-10 w-full p-2 sm:p-3 lg:p-3.5 xl:p-4 rounded-xl sm:rounded-2xl lg:rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.36)] flex flex-col gap-1.5 sm:gap-2.5 lg:gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3.5 lg:gap-4">
                  {/* Строго центрированная кнопка Play/Pause */}
                  <button
                    type="button"
                    onClick={() => onPlayToggle(project.id, project.audioSrc || "/sounds/truboplast-deadpool-glanz.mp3")}
                    aria-label={isPlaying ? "Поставить на паузу" : "Слушать ролик с Петром Гланцем"}
                    className={`shrink-0 relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full transition-all duration-300 shadow-xl active:scale-95 cursor-pointer ${
                      isTuningThis
                        ? "bg-amber-400 text-black shadow-amber-400/40 animate-pulse"
                        : isPlaying
                        ? "bg-[#E22A2A] text-white shadow-[#E22A2A]/50 scale-105"
                        : "bg-white text-[#0A0A0A] hover:bg-[#E22A2A] hover:text-white"
                    }`}
                  >
                    {isPlaying || isTuningThis ? (
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Текстовая плашка диктора и статус */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm lg:text-base font-bold text-white tracking-tight truncate">
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

                  {/* Аккуратный цифровой таймер без рамки */}
                  <AudioDockTime isPlaying={isPlaying} isThisTrack={isThisTrack} />
                </div>

                {/* Полноценный анимированный эквалайзер с интерактивной перемоткой по тапу/клику */}
                <AudioDockEqualizer
                  isPlaying={isPlaying}
                  isTuning={isTuningThis}
                  isThisTrack={isThisTrack}
                  onSeek={onSeek}
                />
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

  const handleSeek = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const targetDuration = audio.duration || 25;
    const newTime = Math.max(0, Math.min(targetDuration, targetDuration * percent));
    audio.currentTime = newTime;
    audioProgressManager.update(newTime, targetDuration);
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
      audioProgressManager.reset();

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
    <section id="work" className="w-full bg-[#F3EFE8] pt-10 sm:pt-16 lg:pt-20 2xl:pt-24 pb-8 sm:pb-12 lg:pb-14 px-3.5 xs:px-4 sm:px-8 lg:px-10 2xl:px-12">
      {/* Скрытый аудиоплеер для надежного воспроизведения без лишней перерисовки секции */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          audioProgressManager.update(el.currentTime, el.duration || 25);
        }}
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          audioProgressManager.update(el.currentTime, el.duration || 25);
        }}
        onEnded={() => {
          setActiveAudioId(null);
          setIsTuning(false);
          audioProgressManager.reset();
        }}
        onError={() => {
          setActiveAudioId(null);
          setIsTuning(false);
          audioProgressManager.reset();
        }}
      />

      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
        
        {/* Заголовок секции */}
        <div className="text-center max-w-3xl 2xl:max-w-4xl mx-auto mb-8 sm:mb-14 lg:mb-16 2xl:mb-20">
          <p className="text-[11px] sm:text-xs 2xl:text-sm font-semibold tracking-[0.2em] text-[#737373] uppercase mb-2 sm:mb-2.5 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-pink" />
            {initialData?.subtitle || "Портфолио / Кейсы"}
          </p>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold text-[#0A0A0A] tracking-tight leading-[1.12] mb-3">
            {initialData?.title || "Проекты, которые приносят результат"}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base 2xl:text-lg text-[#525252] font-normal leading-relaxed max-w-2xl mx-auto">
            Реальные рекламные кампании на радио, магистральных щитах и в полиграфии для бизнеса в Балаково и Поволжье.
          </p>
        </div>

        {/* Стек карточек проектов с динамическим выбором шаблона (Visual / Audio) */}
        <div className="flex flex-col gap-6 sm:gap-10 lg:gap-12 pb-2 sm:pb-4">
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
                onSeek={handleSeek}
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

