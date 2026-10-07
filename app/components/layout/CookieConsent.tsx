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
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/90 backdrop-blur border-t border-gray-200 shadow-lg">
      <div className="max-w-container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4">
        <p className="text-sm text-gray-700">
          Мы используем файлы cookie для улучшения работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
          <a href="/privacy-policy" className="underline">Политикой конфиденциальности</a>.
        </p>
        <button
          type="button"
          onClick={accept}
          className="whitespace-nowrap px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800"
        >
          Принять
        </button>
      </div>
    </div>
  );
}