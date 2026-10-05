"use client";

import Image from "next/image";

export function ContactInfo() {
  return (
    <section id="contact" className="w-full bg-[#F3EFE8] py-16 sm:py-24 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Премиальная карточка-оффер */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-[#111215] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-white/10">
          
          {/* Деликатный атмосферный фоновый градиент */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 80% 60% at 90% 10%, rgba(234, 86, 112, 0.25) 0%, transparent 70%),
                radial-gradient(ellipse 60% 50% at 10% 90%, rgba(139, 92, 246, 0.18) 0%, transparent 70%)
              `,
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-14">
            
            {/* Левая часть: заголовок и УТП */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-white/80 mb-5">
                <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                На связи в Балаково
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
                Готовы запустить рекламу, которая окупается?
              </h2>

              <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
                Рассчитаем медиаплан под ваш бюджет, подберем прайм-тайм эфира или свободные билборды в городе за 15 минут.
              </p>
            </div>

            {/* Правая часть: кнопки быстрого контакта */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 w-full sm:w-auto">
              <a
                href="tel:+79271370750"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-base shadow-lg shadow-brand-pink/30 hover:scale-105 active:scale-95 transition-all text-center"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span>8 927 137-07-50</span>
              </a>

              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base hover:scale-105 active:scale-95 transition-all text-center"
              >
                <Image
                  src="/images/telegram.svg"
                  alt="Telegram"
                  width={20}
                  height={20}
                  className="brightness-200"
                />
                <span>Написать в Telegram</span>
              </a>
            </div>

          </div>

          {/* Нижняя информационная плашка: офис и почта */}
          <div className="relative z-10 mt-10 sm:mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-1">
                Адрес студии и офиса
              </p>
              <p className="text-sm font-medium text-white/90">
                г. Балаково, ул. Факел социализма, 21, офис 207
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-1">
                Электронная почта
              </p>
              <a
                href="mailto:j.chur@inbox.ru"
                className="text-sm font-medium text-white/90 hover:text-brand-pink transition-colors"
              >
                j.chur@inbox.ru
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-1">
                График работы
              </p>
              <p className="text-sm font-medium text-white/90">
                Пн–Пт с 9:00 до 18:00 (прием заявок — 24/7)
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}