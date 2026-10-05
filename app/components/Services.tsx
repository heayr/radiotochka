"use client";

import React, { memo } from "react";
import Image from "next/image";
import Button from "./Button";

interface ServiceItem {
  id: string;
  category: string;
  title: string;
  statNumber: string;
  statLabel: string;
  description: string;
  tags: string[];
  image: string;
  alt: string;
}

const SERVICES: readonly ServiceItem[] = [
  {
    id: "01",
    category: "Радиоресурсы и прямой эфир",
    title: "Реклама на «Дорожном радио» и «НАШЕМ Радио»",
    statNumber: "№1 в Балаково",
    statLabel: "эксклюзивный представитель",
    description:
      "Официальный и эксклюзивный представитель радиостанций «Дорожное радио» и «НАШЕ Радио» в г. Балаково. Прямые договоры со станциями по всему региону: Балаково, Вольск, Пугачёв, Саратов, Пенза, Волгоград. Точный таргетинг и максимальный охват платежеспособных автомобилистов и семейной аудитории.",
    tags: [
      "Дорожное радио &\nНАШЕ Радио",
      "Прямой эфир\nпо Поволжью",
      "Эксклюзивные\nусловия",
    ],
    image: "/images/services/service-01-radio-real.jpg",
    alt: "Профессиональная студия прямого радиоэфира Радиоточка Балаково",
  },
  {
    id: "02",
    category: "Наружная реклама",
    title: "Билборды, сити-форматы и медиаконструкции",
    statNumber: "От визитки",
    statLabel: "до масштабного билборда",
    description:
      "Разработаем дизайн с нуля, качественно напечатаем и разместим на любой законной поверхности в Балаково и области: магистральные щиты 3х6 м, ситиборды, фасадные вывески и крупноформатные рекламные поверхности с максимальным пешеходным и автомобильным трафиком.",
    tags: [
      "Магистральные\nщиты 3х6",
      "Ситиборды\nи вывески",
      "Согласование\nи монтаж",
    ],
    image: "/images/services/service-02-billboard.jpg",
    alt: "Наружная реклама и билборды на дорогах города",
  },
  {
    id: "03",
    category: "Аудиопродакшн полного цикла",
    title: "Изготовление аудиороликов и джинглов",
    statNumber: "Вся Россия",
    statLabel: "и далеко за её пределами",
    description:
      "Собственная звуковая студия «Радиоточка». Аудиоролики, изготовленные на нашей студии, звучат в радиоэфире по всей России и далеко за её пределами. Пишем продающие сценарии, привлекаем профессиональных дикторов, делаем качественный саунд-дизайн и мастеринг. Быстро и профессионально.",
    tags: [
      "Сценарии и\nдраматургия",
      "База федеральных\nдикторов",
      "Мастеринг\nвещания",
    ],
    image: "/images/services/service-03-studio.jpg",
    alt: "Звуковая студия записи радиороликов Радиоточка",
  },
  {
    id: "04",
    category: "Дизайн и оперативная печать",
    title: "Полиграфия и фирменный стиль для бизнеса",
    statNumber: "20+ лет",
    statLabel: "на рекламном рынке",
    description:
      "Разработаем с нуля фирменный стиль и обеспечим ваш бизнес всеми видами качественной полиграфии: визитки, флаеры, буклеты, каталоги, широкоформатная интерьерная и наружная печать баннеров. Контроль качества на собственном оборудовании на каждом этапе.",
    tags: [
      "Фирменный стиль\nи логотипы",
      "Деловая\nполиграфия",
      "Широкоформатная\nпечать",
    ],
    image: "/images/services/service-04-polygraphy.jpg",
    alt: "Полиграфия, дизайн и брендинг для бизнеса",
  },
];

/**
 * Атомарная карточка услуги с каскадным наслоением (Stacking Cards)
 * НА ВСЮ ШИРИНУ ЭКРАНА (100% full screen width, без ограничения контейнера)
 */
const ServiceCard = memo(function ServiceCard({
  service,
  index,
}: {
  service: ServiceItem;
  index: number;
}) {
  // Каскадный отступ сверху для наслоения карточек при скролле
  const stickyTop = `calc(75px + ${index * 22}px)`;

  return (
    <div
      className="sticky w-full transition-all duration-300 ease-out"
      style={{
        top: stickyTop,
        zIndex: index + 1,
      }}
    >
      <div
        className="w-full py-8 sm:py-10 lg:py-12 px-6 sm:px-10 lg:px-14 xl:px-20 border-t border-b border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
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
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-stretch w-full">
          {/* ЛЕВАЯ КОЛОНКА: Номер + Портретное вертикальное фото */}
          <div className="flex gap-4 sm:gap-6 items-start shrink-0">
            <span className="text-xl sm:text-2xl font-extrabold text-white/90 tracking-tight shrink-0 pt-1">
              {service.id}
            </span>

            <div className="relative w-full sm:w-[280px] md:w-[320px] lg:w-[340px] xl:w-[380px] aspect-[4/5] rounded-[26px] sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 group shrink-0">
              <Image
                src={service.image}
                alt={service.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 340px, 380px"
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
                <span className="text-xs sm:text-sm font-medium text-white/60 tracking-normal">
                  {service.category}
                </span>

                <Button
                  href="tel:+79271370750"
                  variant="primary"
                  size="sm"
                  className="!inline-flex !w-auto items-center gap-2 !px-6 !py-2.5 sm:!py-3 !rounded-full !bg-[#FF385C] hover:!bg-[#E02D50] !border-transparent !text-white font-semibold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  <span>Запустить проект</span>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </Button>
              </div>

              {/* Крупный заголовок в точности по референсу */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-5 sm:mb-6">
                {service.title}
              </h3>

              {/* Метрика и текстовое описание */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mb-2.5">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                    {service.statNumber}
                  </span>
                  <span className="text-base sm:text-lg lg:text-xl text-white/70 font-normal">
                    {service.statLabel}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-white/75 font-normal leading-relaxed max-w-4xl">
                  {service.description}
                </p>
              </div>
            </div>

            {/* 3 КРУПНЫЕ СВЕТЛО-БЕЖЕВЫЕ КАРТОЧКИ В РЯД (ТОЧНО КАК В РЕФЕРЕНСЕ) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full mt-auto pt-2">
              {service.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-[#F0ECE4] text-[#0A0A0A] font-bold text-sm sm:text-base p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm min-h-[110px] sm:min-h-[125px] flex items-center justify-start text-left whitespace-pre-line leading-snug transition-transform hover:scale-[1.02]"
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

function BaseServices() {
  return (
    <section id="services" className="w-full bg-[#F3EFE8] pt-16 sm:pt-24 pb-20 sm:pb-32">
      {/* ЗАГОЛОВОК СЕКЦИИ */}
      <div className="w-full px-4 sm:px-8 lg:px-12 text-center max-w-5xl mx-auto mb-14 sm:mb-20">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#737373] uppercase mb-3 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-pink" />
          Радиоточка / Спектр услуг
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A0A0A] tracking-tight leading-[1.15] mb-4">
          Продвижение вашего бизнеса по всем направлениям в Балаково
        </h2>
        <p className="text-base sm:text-lg text-[#555555] font-normal leading-relaxed max-w-2xl mx-auto">
          Радиоэфир, наружная реклама, собственная звуковая студия и полиграфия. Более 20 лет работаем с ведущими предпринимателями региона.
        </p>
      </div>

      {/* КАСКАДНОЕ НАСЛОЕНИЕ КАРТОЧЕК ВО ВСЮ ШИРИНУ ЭКРАНА (100% WIDTH, БЕЗ MAX-W ОГРАНИЧЕНИЯ) */}
      <div className="w-full flex flex-col">
        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

const Services = memo(BaseServices);
export default Services;
