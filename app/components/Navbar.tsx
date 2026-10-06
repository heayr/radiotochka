"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import Button from "./Button";

const navLinks = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/#services" },
  { label: "Процесс", href: "/#process" },
  { label: "Кейсы", href: "/#work" },
  { label: "О нас", href: "/#manifesto" },
  { label: "Контакты", href: "/#contact" },
] as const;

function BaseNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="w-full bg-[#F3EFE8] py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 transition-all relative z-40">
      <div className="w-full flex items-center justify-between">

        {/* Логотип слева в точности по левому отступу референса */}
        <Link href="/" className="flex items-center gap-1 group select-none">
          <Image
            src="/images/main-logo.svg"
            alt="Радиоточка"
            width={34}
            height={34}
            className="h-8 w-8 sm:h-[34px] sm:w-[34px] transition-transform group-hover:scale-105"
            priority
          />
          <span className="font-bold text-2xl sm:text-[26px] text-[#0A0A0A] tracking-tight leading-none">
            Радиоточка
          </span>
        </Link>

        {/* Центр: Утонченные ссылки на Google Font Onest (как на референсе Framer) */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-7 text-[15px] xl:text-[16px] font-medium text-[#262626]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative overflow-hidden inline-flex ${
                  isActive ? "font-semibold text-black" : "text-[#333333]"
                }`}
              >
                <span className="relative inline-flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                  {/* Первый (видимый) текст */}
                  <span className="block">{link.label}</span>
                  
                  {/* Второй текст, который выезжает снизу и красится в фиолетовый */}
                  <span className="absolute top-full left-0 block text-brand-purple" aria-hidden="true">
                    {link.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Правая часть: Капсульная кнопка Связаться ↗ как в Framer GrowthLab */}
        <div className="hidden sm:flex items-center">
          <a
            href="tel:+79271370750"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-white font-semibold text-[15px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Связаться</span>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </div>

        {/* Гамбургер для мобильных */}
        <button
          type="button"
          onClick={handleToggleMenu}
          className="lg:hidden p-2 rounded-xl text-gray-800 hover:bg-black/5 transition-colors"
          aria-label="Открыть меню"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>

      {/* Мобильное выпадающее меню */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-[#EAE0CF] flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleCloseMenu}
              className="px-3 py-2 text-base font-semibold text-gray-800 hover:bg-white/60 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+79271370750"
            className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-sm shadow-sm"
          >
            <span>Позвонить: 8 (927) 137-07-50 ↗</span>
          </a>
        </div>
      )}
    </nav>
  );
}

const Navbar = memo(BaseNavbar);
export default Navbar;
