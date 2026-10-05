import React, { memo } from "react";
import Link from "next/link";

function BaseFooter() {
  return (
    <footer className="w-full bg-[#0A0A0A] text-white pt-20 sm:pt-28 pb-8 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* ВЕРХНИЙ БЛОК: Бренд и описание на всю ширину слева (как в референсе) */}
        <div className="max-w-xl mb-16 sm:mb-20">
          <Link href="/" className="inline-block select-none group mb-4">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white block">
              Радиоточка
            </span>
          </Link>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed font-normal">
            Ведущее рекламное агентство полного цикла в Балаково с 2004 года. Собственный эфирный пул радиостанций, студия звукозаписи, щиты 3х6 и полиграфия.
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
                <Link href="/about" className="hover:text-white transition-colors">
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
                г. Балаково, ул. Факел социализма, 21, оф. 207
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
                  href="https://vk.ru/radio_blk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  ВКонтакте
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+79271370750"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+79271370750"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block"
                >
                  Макс
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
                    href="tel:+79271370750"
                    className="text-sm font-medium text-white hover:text-brand-pink transition-colors block leading-tight"
                  >
                    +7 927 137-07-50
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
                    href="mailto:j.chur@inbox.ru"
                    className="text-sm font-medium text-white hover:text-brand-pink transition-colors block leading-tight"
                  >
                    j.chur@inbox.ru
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
        УТОНЧЕННЫЙ ВОДЯНОЙ ЗНАК «РАДИОТОЧКА» НА ВСЮ ШИРИНУ ЭКРАНА:
        - Вынесен из контейнера max-w-[1360px] для полного растяжения (100% ширины)
        - textLength="1000" (равно ширине viewBox) чтобы буквы растянулись точно от края до края
      */}
      <div className="w-full overflow-hidden select-none pointer-events-none px-4 sm:px-6">
        <svg
          viewBox="0 0 1000 120"
          className="w-full h-auto block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="footerRefinedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EA5670" stopOpacity="0.65" />
              <stop offset="35%" stopColor="#EA5670" stopOpacity="0.25" />
              <stop offset="75%" stopColor="#EA5670" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="98"
            textLength="1000"
            lengthAdjust="spacing"
            fill="url(#footerRefinedGradient)"
            fontSize="100"
            fontWeight="200"
            style={{
              fontFamily: "Urbanist, Onest, system-ui, -apple-system, sans-serif",
              transform: "scaleY(1.3)",
              transformOrigin: "bottom"
            }}
          >
            РАДИОТОЧКА
          </text>
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Нижний копирайт, блок разработчика и ссылка на панель модерации */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Рекламное агентство «Радиоточка». г. Балаково. Все права защищены.</p>

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
