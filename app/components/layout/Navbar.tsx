"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useCallback, memo } from "react";
import { usePathname } from "next/navigation";

import { MAIN_NAV_LINKS as navLinks } from "@/constants/navigation";
import {
  DEFAULT_NAVBAR_DATA,
  type NavbarSectionData,
} from "@/types/site-content";

interface NavbarProps {
  initialData?: NavbarSectionData;
}

function BaseNavbar({ initialData }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const config = initialData ?? DEFAULT_NAVBAR_DATA;
  const mode = config.mode || "image";
  const logoHeight = config.logoHeight || 40;
  const logoSrc = config.logoSrc || "/images/Radiotochka logo horizontal EXTRA CLEAN.svg";
  const logoAlt = config.logoAlt || "Радиоточка — Рекламное агентство";
  const text = config.text || "Радиоточка";
  const href = config.href || "/";

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="w-full bg-[#F3EFE8] py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-10 2xl:px-12 transition-all relative z-40">
      <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between">

        {/* Логотип слева */}
        <Link
          href={href}
          className="flex items-center gap-2 group select-none py-1"
          aria-label={logoAlt}
        >
          {mode === "image" && logoSrc && (
            <img
              src={logoSrc}
              alt={logoAlt}
              style={{ height: `${logoHeight}px`, width: "auto" }}
              className="max-h-16 w-auto transition-opacity group-hover:opacity-90"
            />
          )}

          {mode === "split" && (
            <>
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  style={{ height: `${logoHeight}px`, width: "auto" }}
                  className="max-h-16 w-auto transition-opacity group-hover:opacity-90"
                />
              )}
              <span className="font-bold text-xl xs:text-2xl sm:text-[26px] text-[#0A0A0A] tracking-tight leading-none">
                {text}
              </span>
            </>
          )}

          {mode === "text" && (
            <span className="font-bold text-xl xs:text-2xl sm:text-[26px] text-[#0A0A0A] tracking-tight leading-none">
              {text}
            </span>
          )}
        </Link>

        {/* Центр: Утонченные ссылки на Google Font Onest (как на референсе Framer) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7 text-[15px] xl:text-[16px] font-medium text-[#262626]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group inline-flex items-center py-2 px-2.5 -my-2 -mx-2.5 rounded-lg transition-colors hover:bg-black/[0.03] ${
                  isActive ? "font-semibold text-black" : "text-[#333333]"
                }`}
              >
                <span className="relative overflow-hidden h-[1.35em] inline-block">
                  <span className="relative inline-flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                    {/* Первый (видимый) текст */}
                    <span className="block leading-[1.35]">{link.label}</span>
                    
                    {/* Второй текст, который выезжает снизу и красится в фиолетовый */}
                    <span className="absolute top-full left-0 block text-brand-purple leading-[1.35]" aria-hidden="true">
                      {link.label}
                    </span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Правая часть: Капсульная кнопка Связаться ↗ (стабильный хитбокс без дергания на ховере) */}
        <div className="hidden sm:flex items-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 px-6 2xl:px-7 py-3 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-white font-semibold text-[15px] 2xl:text-[16px] shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
          >
            <span>Связаться</span>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </div>

        {/* Гамбургер для мобильных с удобным тач-таргетом 44x44px */}
        <button
          type="button"
          onClick={handleToggleMenu}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-gray-800 hover:bg-black/5 active:scale-95 transition-all"
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
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-[#EAE0CF]">
            <a
              href="tel:+79271370750"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-xs xs:text-sm shadow-sm w-full"
            >
              <span>Позвонить: 8 (927) 137-07-50 ↗</span>
            </a>
            <a
              href="#contact"
              onClick={handleCloseMenu}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-gray-800 font-semibold text-xs xs:text-sm w-full transition-colors"
            >
              <span>Связаться с нами</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

const Navbar = memo(BaseNavbar);
export default Navbar;
