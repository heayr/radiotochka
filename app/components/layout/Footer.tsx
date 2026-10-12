"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import { copyToClipboard } from "@/app/components/ui/Toast";
import {
  FOOTER_NAV_LINKS,
  FOOTER_SERVICE_LINKS,
} from "@/constants/navigation";
import {
  DEFAULT_FOOTER_DATA,
  type FooterSectionData,
} from "@/types/site-content";
import FooterWatermark from "./FooterWatermark";

interface FooterProps {
  initialData?: Partial<FooterSectionData>;
}

interface FooterColumnProps {
  title: string;
  delayClass: string;
  isVisible: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Универсальная колонка футера с каскадной анимацией появления */
function FooterColumn({
  title,
  delayClass,
  isVisible,
  className = "",
  children,
}: FooterColumnProps) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${delayClass} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      <h4 className="text-sm 2xl:text-base font-semibold text-white/50 mb-3 sm:mb-5 2xl:mb-6">
        {title}
      </h4>
      {children}
    </div>
  );
}

/** Карточка контактных данных с интерактивной микро-анимацией */
function ContactCard({
  icon,
  label,
  href,
  subtext,
  nudgeClass,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  subtext: string;
  nudgeClass: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
}) {
  return (
    <div
      className={`group ${nudgeClass} hover:[animation-play-state:paused] flex items-start gap-3 p-2.5 -m-2 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300`}
    >
      <div className="shrink-0 text-white/80 group-hover:text-brand-pink group-hover:scale-110 transition-all mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <a
          href={href}
          onClick={onClick}
          title={title}
          className="text-sm 2xl:text-[17px] font-medium text-white group-hover:text-brand-pink transition-colors block leading-tight cursor-pointer"
        >
          {label}
        </a>
        <span className="text-xs 2xl:text-sm text-white/40 block mt-1">
          {subtext}
        </span>
      </div>
    </div>
  );
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

  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { label: "ВКонтакте ↗", href: vkUrl, isExternal: true },
    { label: "Telegram ↗", href: telegramUrl, isExternal: true },
    { label: "МАКС ↗", href: maxUrl || "#", isExternal: Boolean(maxUrl && maxUrl !== "#") },
  ];

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="w-full bg-[#0A0A0A] text-white pt-10 sm:pt-14 lg:pt-16 pb-8 overflow-hidden"
    >
      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 2xl:px-16">
        {/* Бренд и описание */}
        <div
          className={`max-w-xl 2xl:max-w-3xl mb-14 sm:mb-20 2xl:mb-24 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link href="/" className="inline-block select-none group mb-4">
            <span className="text-3xl sm:text-4xl 2xl:text-5xl font-bold tracking-tight text-white block">
              Радиоточка
            </span>
          </Link>
          <p className="text-sm sm:text-base 2xl:text-xl text-white/60 leading-relaxed font-normal">
            {brandDescription}
          </p>
        </div>

        {/* Сетка колонок */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-8 sm:pb-16">
          <FooterColumn title="Навигация" delayClass="delay-100" isVisible={isVisible}>
            <ul className="space-y-1 sm:space-y-1.5 text-sm 2xl:text-[17px] font-normal text-white/80">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block py-1.5 2xl:py-2 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Услуги" delayClass="delay-200" isVisible={isVisible}>
            <ul className="space-y-1 sm:space-y-1.5 text-sm 2xl:text-[17px] font-normal text-white/80">
              {FOOTER_SERVICE_LINKS.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="block py-1.5 2xl:py-2 hover:text-white transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Офис" delayClass="delay-300" isVisible={isVisible}>
            <div className="text-sm 2xl:text-[17px] font-normal text-white/80">
              <p className="text-white/60 leading-relaxed py-1.5 2xl:py-2">
                {officeAddress}
              </p>
            </div>
          </FooterColumn>

          <FooterColumn title="Соцсети" delayClass="delay-400" isVisible={isVisible}>
            <ul className="space-y-1 sm:space-y-1.5 text-sm 2xl:text-[17px] font-normal text-white/80">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="block py-1.5 2xl:py-2 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn
            title="Контакты"
            delayClass="delay-500"
            isVisible={isVisible}
            className="col-span-2 sm:col-span-1"
          >
            <div className="space-y-3 sm:space-y-4">
              <ContactCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path fill="currentColor" d="M19.95 21q-3.125 0-6.175-1.362t-5.55-3.863q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3h3.05q.35 0 .625.238t.325.562l.65 3.5q.05.35-.025.638T8.4 8.45L6.1 10.75q1.125 1.95 2.575 3.4t3.4 2.575l2.3-2.3q.25-.25.55-.337t.65-.013l3.5.7q.35.075.575.338t.225.612v3.05q0 .45-.3.75t-.75.3Z" />
                  </svg>
                }
                label={phonePrimary}
                href={`tel:${phonePrimary.replace(/[^\d+]/g, "")}`}
                subtext="Пн–Пт с 9:00 до 18:00"
                nudgeClass="animate-contact-nudge-1"
                title="Нажмите для вызова или копирования"
                onClick={(e) => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    e.preventDefault();
                    copyToClipboard(phonePrimary, `Телефон скопирован: ${phonePrimary}`);
                  }
                }}
              />

              <ContactCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20H4Zm8-7l8-5V6l-8 5l-8-5v2l8 5Z" />
                  </svg>
                }
                label={email}
                href={`mailto:${email}`}
                subtext="Медиапланы и документооборот"
                nudgeClass="animate-contact-nudge-2"
              />
            </div>
          </FooterColumn>
        </div>
      </div>

      {/* Водяной знак */}
      <FooterWatermark isVisible={isVisible} />

      {/* Нижний бар */}
      <div
        className={`max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 2xl:px-16 transition-all duration-700 ease-out delay-800 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
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
                className="text-white/75 hover:text-white underline underline-offset-2 transition-colors font-medium py-1 inline-block"
              >
                yegor-dev.vercel.app
              </a>
            </span>
            <span className="hidden sm:inline text-white/20">·</span>
            <a
              href="mailto:egormyshinsky@gmail.com"
              className="text-white/60 hover:text-brand-pink transition-colors py-1 inline-block"
            >
              egormyshinsky@gmail.com
            </a>
          </div>

          <Button
            href="/admin/content"
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-white hover:bg-white/5 py-1 px-2.5 rounded-md text-xs 2xl:text-sm font-normal"
          >
            Панель модерации
          </Button>
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(BaseFooter);
export default Footer;
