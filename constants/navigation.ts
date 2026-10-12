/**
 * Единый источник истины (Single Source of Truth) для навигации сайта.
 * Используется в Navbar, Footer и мобильном меню.
 */

export interface NavLinkItem {
  label: string;
  href: string;
}

export const MAIN_NAV_LINKS: readonly NavLinkItem[] = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/#services" },
  { label: "Процесс", href: "/#process" },
  { label: "Кейсы", href: "/#work" },
  { label: "О нас", href: "/#manifesto" },
  { label: "Контакты", href: "/#contact" },
] as const;

export const FOOTER_NAV_LINKS: readonly NavLinkItem[] = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/#services" },
  { label: "Процесс", href: "/#process" },
  { label: "Кейсы", href: "/#work" },
  { label: "О нас", href: "/#manifesto" },
] as const;

export const FOOTER_SERVICE_LINKS: readonly NavLinkItem[] = [
  { label: "Дорожное радио", href: "/#services" },
  { label: "НАШЕ Радио", href: "/#services" },
  { label: "Щиты 3х6", href: "/#services" },
  { label: "Звукозапись", href: "/#services" },
  { label: "Полиграфия", href: "/#services" },
] as const;
