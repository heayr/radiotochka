"use client";

import { useEffect, useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 py-3.5 sm:py-4">
        <p className="text-xs sm:text-sm text-gray-700 text-center sm:text-left leading-relaxed">
          Мы используем файлы cookie для улучшения работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
          <a href="/privacy-policy" className="underline hover:text-black">Политикой конфиденциальности</a>.
        </p>
        <button
          type="button"
          onClick={accept}
          className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-black text-white text-xs sm:text-sm font-semibold hover:bg-gray-800 transition-colors w-full sm:w-auto text-center shrink-0"
        >
          Принять
        </button>
      </div>
    </div>
  );
}