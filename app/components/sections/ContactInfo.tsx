"use client";

import Image from "next/image";
import { SectionHeader } from "@/app/components/sections/SectionHeader";

export function ContactInfo() {
  return (
    <section className="mt-fluid-section" id="consultation">
      <SectionHeader
        title="Свяжитесь с нами"
        subtitle="Есть вопросы или предложения? Напишите нам удобным способом"
        href="#services"
        className="mb-8"
      />

      <div className="max-w-container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div>
            <h3 className="text-xl font-medium bg-default-lime px-3 py-1 rounded-md inline-block mb-6">
              Контакты
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700 text-base">
                Email:{" "}
                <a href="mailto:j.chur@inbox.ru" className="hover:underline">
                  j.chur@inbox.ru
                </a>
              </p>
              <p className="text-gray-700 text-base">
                Телефон:{" "}
                <a href="tel:+79271370750" className="hover:underline">
                  8 927 137-07-50
                </a>
              </p>
              <p className="text-gray-700 text-base max-w-xs">
                Адрес: 413857, г. Балаково, ул. Факел социализма, 21, офис 207
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium bg-default-lime px-3 py-1 rounded-md inline-block mb-6">
              Мы в соцсетях
            </h3>
            <div className="flex gap-6">
              <a href="#" aria-label="Telegram">
                <Image
                  src="/images/telegram.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                />
              </a>
              <a href="#" aria-label="VK">
                <Image src="/images/vk.svg" alt="VK" width={24} height={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}