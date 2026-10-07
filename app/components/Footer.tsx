import React, { memo } from "react";
import Link from "next/link";
import {
  DEFAULT_FOOTER_DATA,
  type FooterSectionData,
} from "@/types/site-content";

interface FooterProps {
  initialData?: Partial<FooterSectionData>;
}

function BaseFooter({ initialData }: FooterProps) {
  const brandDescription =
    initialData?.brandDescription || DEFAULT_FOOTER_DATA.brandDescription;
  const officeAddress =
    initialData?.officeAddress || DEFAULT_FOOTER_DATA.officeAddress;
  const phonePrimary =
    initialData?.phonePrimary || DEFAULT_FOOTER_DATA.phonePrimary;
  const email = initialData?.email || DEFAULT_FOOTER_DATA.email;
  const vkUrl = initialData?.vkUrl || DEFAULT_FOOTER_DATA.vkUrl;
  const telegramUrl = initialData?.telegramUrl || DEFAULT_FOOTER_DATA.telegramUrl;
  const maxUrl = initialData?.maxUrl || DEFAULT_FOOTER_DATA.maxUrl;
  const legalInfo = initialData?.legalInfo || DEFAULT_FOOTER_DATA.legalInfo;

  return (
    <footer id="contact" className="w-full bg-[#0A0A0A] text-white pt-20 sm:pt-28 2xl:pt-36 pb-8 overflow-hidden">
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 2xl:px-16">
        
        {/* ВЕРХНИЙ БЛОК: Бренд и описание на всю ширину слева (как в референсе) */}
        <div className="max-w-xl 2xl:max-w-2xl mb-16 sm:mb-20 2xl:mb-24">
          <Link href="/" className="inline-block select-none group mb-4">
            <span className="text-3xl sm:text-4xl 2xl:text-5xl font-bold tracking-tight text-white block">
              Радиоточка
            </span>
          </Link>
          <p className="text-sm sm:text-base 2xl:text-lg text-white/60 leading-relaxed font-normal">
            {brandDescription}
          </p>
        </div>

        {/* СЕТКА КОЛОНОК: В один горизонтальный ряд на всю ширину (как в референсе) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-8 sm:pb-16">
          
          {/* Колонка 1: Навигация */}
          <div>
            <h4 className="text-sm font-medium text-white/50 mb-5">
              Навигация
            </h4>
            <ul className="space-y-3 text-sm font-normal text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-white transition-colors">
                  Процесс
                </Link>
              </li>
              <li>
                <Link href="/#work" className="hover:text-white transition-colors">
                  Кейсы
                </Link>
              </li>
              <li>
                <Link href="/#manifesto" className="hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка 2: Услуги */}
          <div>
            <h4 className="text-sm font-medium text-white/50 mb-5">
              Услуги
            </h4>
            <ul className="space-y-3 text-sm font-normal text-white/80">
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Дорожное радио
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  НАШЕ Радио
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Щиты 3х6
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Звукозапись
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Полиграфия
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Офис */}
          <div>
            <h4 className="text-sm font-medium text-white/50 mb-5">
              Офис
            </h4>
            <div className="space-y-3 text-sm font-normal text-white/80">
              <p className="text-white/60">
                {officeAddress}
              </p>
            </div>
          </div>

          {/* Колонка 4: Соцсети (ЧИСТЫЙ ТЕКСТОВЫЙ СПИСОК КАК В РЕФЕРЕНСЕ, БЕЗ КНОПОК) */}
          <div>
            <h4 className="text-sm font-medium text-white/50 mb-5">
              Соцсети
            </h4>
            <ul className="space-y-3 text-sm font-normal text-white/80">
              <li>
                <a
                  href={vkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  ВКонтакте
                </a>
              </li>
              <li>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={maxUrl || "#"}
                  target={maxUrl && maxUrl !== "#" ? "_blank" : undefined}
                  rel={maxUrl && maxUrl !== "#" ? "noopener noreferrer" : undefined}
                  className="hover:text-white transition-colors block cursor-pointer"
                >
                  МАКС
                </a>
              </li>
            </ul>
          </div>

          {/* Колонка 5: Есть вопросы? (ПРЯМЫЕ ИКОНКИ БЕЗ КВАДРАТОВ И БЕЙДЖЕЙ, КАК В РЕФЕРЕНСЕ) */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-medium text-white/50 mb-5">
              Есть вопросы?
            </h4>
            <div className="space-y-4">
              
              {/* Телефон через +7 */}
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 text-white mt-0.5"
                >
                  <path
                    fill="currentColor"
                    d="M19.95 21q-3.125 0-6.175-1.362t-5.55-3.863q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3h3.05q.35 0 .625.238t.325.562l.65 3.5q.05.35-.025.638T8.4 8.45L6.1 10.75q1.125 1.95 2.575 3.4t3.4 2.575l2.3-2.3q.25-.25.55-.337t.65-.013l3.5.7q.35.075.575.338t.225.612v3.05q0 .45-.3.75t-.75.3Z"
                  />
                </svg>
                <div>
                  <a
                    href={`tel:${phonePrimary.replace(/[^\d+]/g, "")}`}
                    className="text-sm font-medium text-white hover:text-brand-pink transition-colors block leading-tight"
                  >
                    {phonePrimary}
                  </a>
                  <span className="text-xs text-white/40 block mt-0.5">
                    Пн–Пт с 9:00 до 18:00
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 text-white mt-0.5"
                >
                  <path
                    fill="currentColor"
                    d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20H4Zm8-7l8-5V6l-8 5l-8-5v2l8 5Z"
                  />
                </svg>
                <div>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-medium text-white hover:text-brand-pink transition-colors block leading-tight"
                  >
                    {email}
                  </a>
                  <span className="text-xs text-white/40 block mt-0.5">
                    Медиапланы и документооборот
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 
        ВОДЯНОЙ ЗНАК «РАДИОТОЧКА» НА ВСЮ ШИРИНУ ЭКРАНА:
        - Занимает 100% ширины экрана от левого до правого края (w-full, px-0)
        - Крупный по высоте (fontSize="240", просторный viewBox 1400x320)
        - Тонкие изящные буквы (fontWeight="200") без сплющивания (lengthAdjust="spacing")
        - Запас 80px сверху и 70px снизу исключает любое обрезание
      */}
      <div className="w-full max-w-[1720px] mx-auto overflow-hidden select-none pointer-events-none my-6 sm:my-12 2xl:my-16 px-4 flex justify-center">
        <svg
          viewBox="0 0 1400 320"
          className="w-full max-h-[280px] 2xl:max-h-[320px] h-auto block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="footerRefinedGradient" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#EA5670" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#EA5670" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#EA5670" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="250"
            textLength="1400"
            lengthAdjust="spacing"
            fill="url(#footerRefinedGradient)"
            fontSize="240"
            fontWeight="200"
            fontFamily="'Onest', -apple-system, BlinkMacSystemFont, sans-serif"
          >
            РАДИОТОЧКА
          </text>
        </svg>
      </div>

      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 2xl:px-16">
        {/* Нижний копирайт, блок разработчика и ссылка на панель модерации */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs 2xl:text-sm text-white/40">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Рекламное агентство «Радиоточка». г. Балаково.</p>
            {legalInfo && (
              <>
                <span className="hidden sm:inline text-white/20">•</span>
                <p className="text-white/60 font-mono text-[11px]">{legalInfo}</p>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center lg:text-left">
            <span>
              Запрограмлено и задизайнено —{" "}
              <a
                href="https://yegor-dev.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 hover:text-white underline underline-offset-2 transition-colors font-medium"
              >
                yegor-dev.vercel.app
              </a>
            </span>
            <span className="hidden sm:inline text-white/20">·</span>
            <a
              href="mailto:egormyshinsky@gmail.com"
              className="text-white/60 hover:text-brand-pink transition-colors"
            >
              egormyshinsky@gmail.com
            </a>
          </div>

          <a href="/admin/content" className="hover:text-white/70 transition-colors">
            Панель модерации
          </a>
        </div>
      </div>
    </footer>
  );
}

const Footer = memo(BaseFooter);
export default Footer;
