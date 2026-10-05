"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface AdminNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Редактор секций",
      href: "/admin/content",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      label: "Пользователи",
      href: "/admin/users",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: "Мой аккаунт",
      href: "/dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F0F11] border-b border-white/10 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Бренд + бейдж панели */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-brand-pink transition-colors">
                Радиоточка
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-white/10 text-brand-pink border border-white/10">
              Кабинет модерации
            </span>
          </div>

          {/* Вкладки навигации */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = Boolean(pathname && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white font-semibold shadow-inner"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={isActive ? "text-brand-pink" : "text-white/60"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Правая часть: быстрые действия, юзер и выход */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white px-2.5 py-1 rounded-lg border border-white/15 hover:border-white/30 transition-all"
              title="Открыть сайт в новой вкладке"
            >
              <span>Сайт</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            {user && (
              <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-xs font-semibold text-white/90">
                  {user.email || user.name}
                </span>
                <span className="text-[10px] uppercase font-mono text-brand-pink">
                  {user.role}
                </span>
              </div>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              type="button"
              className="text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-red-500/20 hover:text-red-300 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all"
              title="Выйти из аккаунта"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
