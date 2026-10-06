"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import { EditorFormFooter } from "@/app/components/ui/EditorFormFooter";
import type { EditorProps } from "./editor-types";
import {
  DEFAULT_FOOTER_DATA,
  type FooterSectionData,
} from "@/types/site-content";

export function FooterEditor({ block, onSave, onCancel }: EditorProps) {
  const content = (block.content || {}) as Partial<FooterSectionData>;

  const [brandDescription, setBrandDescription] = useState(
    content.brandDescription || DEFAULT_FOOTER_DATA.brandDescription
  );
  const [officeAddress, setOfficeAddress] = useState(
    content.officeAddress || DEFAULT_FOOTER_DATA.officeAddress
  );
  const [phonePrimary, setPhonePrimary] = useState(
    content.phonePrimary || DEFAULT_FOOTER_DATA.phonePrimary
  );
  const [phoneSecondary, setPhoneSecondary] = useState(
    content.phoneSecondary || DEFAULT_FOOTER_DATA.phoneSecondary
  );
  const [email, setEmail] = useState(
    content.email || DEFAULT_FOOTER_DATA.email
  );
  const [vkUrl, setVkUrl] = useState(
    content.vkUrl || DEFAULT_FOOTER_DATA.vkUrl
  );
  const [telegramUrl, setTelegramUrl] = useState(
    content.telegramUrl || DEFAULT_FOOTER_DATA.telegramUrl
  );
  const [maxUrl, setMaxUrl] = useState(
    content.maxUrl || DEFAULT_FOOTER_DATA.maxUrl || "#"
  );
  const [legalInfo, setLegalInfo] = useState(
    content.legalInfo || DEFAULT_FOOTER_DATA.legalInfo
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleResetToDefault = () => {
    if (confirm("Сбросить контакты и футер к значениям по умолчанию?")) {
      setBrandDescription(DEFAULT_FOOTER_DATA.brandDescription);
      setOfficeAddress(DEFAULT_FOOTER_DATA.officeAddress);
      setPhonePrimary(DEFAULT_FOOTER_DATA.phonePrimary);
      setPhoneSecondary(DEFAULT_FOOTER_DATA.phoneSecondary);
      setEmail(DEFAULT_FOOTER_DATA.email);
      setVkUrl(DEFAULT_FOOTER_DATA.vkUrl);
      setTelegramUrl(DEFAULT_FOOTER_DATA.telegramUrl);
      setMaxUrl(DEFAULT_FOOTER_DATA.maxUrl);
      setLegalInfo(DEFAULT_FOOTER_DATA.legalInfo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data: FooterSectionData = {
        brandDescription,
        officeAddress,
        phonePrimary,
        phoneSecondary,
        email,
        vkUrl,
        telegramUrl,
        maxUrl,
        legalInfo,
      };
      await onSave(data as unknown as Record<string, unknown>);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h4 className="text-base font-bold text-gray-900">
            📍 Контакты и подвал (Footer)
          </h4>
          <p className="text-xs text-gray-500">
            Контактные телефоны, email, физический адрес офиса, соцсети и реквизиты компании.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResetToDefault}
        >
          Вернуть по умолчанию
        </Button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Описание агентства под логотипом
        </label>
        <textarea
          rows={3}
          value={brandDescription}
          onChange={(e) => setBrandDescription(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Адрес офиса в Балаково
          </label>
          <input
            type="text"
            value={officeAddress}
            onChange={(e) => setOfficeAddress(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email для медиапланов
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Основной телефон (прямой)
          </label>
          <input
            type="text"
            value={phonePrimary}
            onChange={(e) => setPhonePrimary(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Дополнительный телефон (городской)
          </label>
          <input
            type="text"
            value={phoneSecondary}
            onChange={(e) => setPhoneSecondary(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Ссылка ВКонтакте
          </label>
          <input
            type="text"
            value={vkUrl}
            onChange={(e) => setVkUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="https://vk.com/..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Ссылка Telegram
          </label>
          <input
            type="text"
            value={telegramUrl}
            onChange={(e) => setTelegramUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="https://t.me/..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Ссылка МАКС
          </label>
          <input
            type="text"
            value={maxUrl}
            onChange={(e) => setMaxUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="#"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Укажите URL или оставьте «#» (кликабельная ссылка без перехода).
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Юридические реквизиты компании
        </label>
        <input
          type="text"
          value={legalInfo}
          onChange={(e) => setLegalInfo(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none font-mono text-xs"
          placeholder="ИП Чурилова Ж.И. • ОГРНИП 319645100006105 • ИНН 643908571782"
        />
      </div>

      {/* Живое превью */}
      <div className="bg-[#0A0A0A] text-white rounded-xl p-6 border border-gray-800 space-y-4">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
          Превью блока контактов
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">Офис</span>
            <p className="text-white/80">{officeAddress}</p>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Телефон</span>
            <p className="text-[#ea5670] font-semibold">{phonePrimary}</p>
            <p className="text-white/40 text-[11px] mt-0.5">{phoneSecondary}</p>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Email & Соцсети</span>
            <p className="text-white/90">{email}</p>
            <p className="text-gray-400 text-[11px] mt-0.5">
              VK • Telegram • МАКС ({maxUrl})
            </p>
          </div>
        </div>
      </div>


      <EditorFormFooter
        isLoading={isLoading}
        onCancel={onCancel}
        saveLabel="Сохранить контакты и футер"
      />
    </form>
  );
}
