export interface ServiceCardItem {
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

export interface ServiceBottomCard {
  title: string;
  description: string;
}

export interface ServicesSectionData {
  title?: string;
  items: ServiceCardItem[];
  bottomCards: ServiceBottomCard[];
}

export const DEFAULT_SERVICES_DATA: ServicesSectionData = {
  title: "Наши услуги",
  items: [
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
        "Федеральные\nдикторы",
        "Лицензионная\nмузыка",
        "Готовый ролик\nза 24 часа",
      ],
      image: "/images/services/service-03-studio.jpg",
      alt: "Звукорежиссер за пультом аудиопродакшна студии Радиоточка",
    },
  ],
  bottomCards: [
    {
      title: "Аудиореклама",
      description: "Качественный звук, сценарий и профессиональные дикторы.",
    },
    {
      title: "Медиапланирование",
      description: "Индивидуальный расчет под ваш бюджет и целевую аудиторию.",
    },
    {
      title: "Быстрый старт",
      description: "Запуск рекламной кампании в эфир в кратчайшие сроки.",
    },
  ],
};

export interface WorkProjectItem {
  id: string;
  title: string;
  description: string;
  client: string;
  services: string[];
  imageSrc: string;
  href: string;
}

export interface WorkSectionData {
  title?: string;
  subtitle?: string;
  items: WorkProjectItem[];
}

export const DEFAULT_WORK_DATA: WorkSectionData = {
  title: "Избранные проекты",
  subtitle: "Кейсы агентства",
  items: [
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
  ],
};

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
}

export interface ProcessSectionData {
  title?: string;
  items: ProcessStepItem[];
}

export const DEFAULT_PROCESS_DATA: ProcessSectionData = {
  title: "Как мы работаем",
  items: [
    {
      number: "01",
      title: "Исследование",
      description:
        "Анализируем аудиторию и рынок, находя самые конверсионные точки контакта.",
      imageSrc: "/images/process/step-01.jpg",
    },
    {
      number: "02",
      title: "Медиаплан",
      description:
        "Подбираем прайм-тайм станций и экраны под ваш бюджет без лишних переплат.",
      imageSrc: "/images/process/step-02.jpg",
    },
    {
      number: "03",
      title: "Продакшн",
      description:
        "Создаем цепляющий ролик с дикторами и запускаем эфир день в день.",
      imageSrc: "/images/process/step-03.jpg",
    },
    {
      number: "04",
      title: "Аналитика",
      description:
        "Отслеживаем входящие звонки и масштабируем охват с прозрачными отчетами.",
      imageSrc: "/images/process/step-04.jpg",
    },
  ],
};

export interface StatMetricItem {
  value: string;
  label: string;
}

export interface ServicePillItem {
  label: string;
  href: string;
}

export interface StatsSectionData {
  title?: string;
  offerText?: string;
  metrics: StatMetricItem[];
  pills: ServicePillItem[];
  desktopBanner: string;
  mobileBanner: string;
}

export const DEFAULT_STATS_DATA: StatsSectionData = {
  title: "Радиоточка в цифрах",
  offerText:
    "Медиапланирование, радиоэфир «Дорожное радио» и «Наше Радио», наружные экраны и полиграфия — созданы масштабировать ваш бизнес и привлекать реальных покупателей.",
  metrics: [
    {
      value: "20+",
      label: "Лет успешной работы в Балаково",
    },
    {
      value: "80 000+",
      label: "Слушателей ежедневно в регионе",
    },
    {
      value: "100%",
      label: "Прямой эфирный пул без наценок",
    },
  ],
  pills: [
    { label: "Прямой эфир 104.7 & 98.4 FM", href: "#services" },
    { label: "Медиафасады и наружная реклама", href: "#services" },
    { label: "Аудио-продакшн за 24ч", href: "#services" },
    { label: "Широкоформатная печать", href: "#services" },
  ],
  desktopBanner: "/images/stats-banner-desktop.jpg",
  mobileBanner: "/images/stats-banner-mobile.jpg",
};

export interface ManifestoSectionData {
  text: string;
  since: string;
  cities: string[];
}

export const DEFAULT_MANIFESTO_DATA: ManifestoSectionData = {
  text: "Мы не делаем рекламу «ради галочки». Каждая кампания на радио и городских экранах строится под конкретные цифры и продажи, пока показатели бизнеса реально не пойдут вверх.",
  since: "SINCE 2004",
  cities: ["БАЛАКОВО", "САРАТОВ", "ВОЛЬСК"],
};

export interface HeroSectionData {
  copyrightYear: string;
  agencyLabel: string;
  bannerWord: string;
}

export const DEFAULT_HERO_DATA: HeroSectionData = {
  copyrightYear: "©2026",
  agencyLabel: "AGENCY",
  bannerWord: "МАРКЕТИНГ",
};

export interface MarqueeSectionData {
  phrases: string[];
}

export const DEFAULT_MARQUEE_DATA: MarqueeSectionData = {
  phrases: [
    "РАДИОРЕКЛАМА",
    "104.7 FM ДОРОЖНОЕ РАДИО",
    "НАРУЖНАЯ РЕКЛАМА",
    "МЕДИАФАСАДЫ В БАЛАКОВО",
    "98.4 FM НАШЕ РАДИО",
    "АУДИОРОЛИКИ ПОД КЛЮЧ",
    "ШИРОКОФОРМАТНАЯ ПЕЧАТЬ",
    "БИЛБОРДЫ И СИТИ-ФОРМАТЫ",
  ],
};

export interface FooterSectionData {
  brandDescription: string;
  officeAddress: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  vkUrl: string;
  telegramUrl: string;
  maxUrl: string;
  legalInfo: string;
}

export const DEFAULT_FOOTER_DATA: FooterSectionData = {
  brandDescription:
    "Ведущее рекламное агентство полного цикла в Балаково с 2004 года. Собственный эфирный пул радиостанций, студия звукозаписи, щиты 3х6 и полиграфия.",
  officeAddress: "г. Балаково, ул. Факел социализма, 21, оф. 207",
  phonePrimary: "+7 (927) 137-07-50",
  phoneSecondary: "+7 (8453) 44-00-55",
  email: "j.chur@inbox.ru",
  vkUrl: "https://vk.com/radiotochka_balakovo",
  telegramUrl: "https://t.me/+79271370750",
  maxUrl: "#",
  legalInfo:
    "ИП Чуркина Ю.А. • ОГРНИП 318645100085392 • ИНН 643904996901",
};

