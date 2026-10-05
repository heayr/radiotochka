"use client";

import { useState, useCallback, useMemo, memo } from "react";
import Button from "./Button";
import { SectionHeader } from "./sections/SectionHeader";

const CHANNELS = [
  { id: "radio", label: "Радиовещание", desc: "Дорожное / Наше Радио", icon: "📻" },
  { id: "billboards", label: "Наружная реклама", desc: "Билборды 3х6 / экраны", icon: "🏢" },
  { id: "print", label: "Полиграфия", desc: "Печать любого формата", icon: "📄" },
  { id: "complex", label: "Комплекс под ключ", desc: "Максимальный охват", icon: "⚡" },
];

const PERIODS = [
  { id: "2weeks", label: "2 недели", multiplier: 1 },
  { id: "1month", label: "1 месяц", multiplier: 1.8, discount: "Скидка 10%" },
  { id: "3months", label: "3 месяца", multiplier: 4.5, discount: "Скидка 20%" },
];

function BaseAdCalculator() {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["radio"]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1month");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleChannel = useCallback((id: string) => {
    if (id === "complex") {
      setSelectedChannels(["radio", "billboards", "print"]);
      return;
    }
    setSelectedChannels((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((c) => c !== id) : prev;
      }
      return [...prev, id];
    });
  }, []);

  // Ориентировочный расчет охвата (Referential Stability)
  const estimatedReach = useMemo(() => {
    const multiplier =
      selectedPeriod === "3months" ? 180000 : selectedPeriod === "1month" ? 95000 : 45000;
    return selectedChannels.length * multiplier;
  }, [selectedChannels.length, selectedPeriod]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPhone((currentPhone) => {
      if (currentPhone.trim()) {
        setIsSubmitted(true);
      }
      return currentPhone;
    });
  }, []);

  return (
    <section className="mt-fluid-section" id="calculator">
      <SectionHeader
        title="Экспресс-расчет"
        subtitle="Соберите оптимальный медиаплан за 30 секунд и получите предварительный расчет со скидкой."
        href="#calculator"
      />

      <div className="max-w-container mx-auto">
        <div className="bg-default-grey rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Левая колонка: параметры */}
            <div className="lg:col-span-7 space-y-6">
              {/* Шаг 1: Каналы */}
              <div>
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider block mb-3">
                  1. Выберите рекламные каналы:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CHANNELS.map((ch) => {
                    const isSelected =
                      ch.id === "complex"
                        ? selectedChannels.length >= 3
                        : selectedChannels.includes(ch.id);

                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => toggleChannel(ch.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? "border-brand-pink bg-white shadow-sm ring-1 ring-brand-pink"
                            : "border-gray-200 bg-white/70 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl">{ch.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-950 text-sm sm:text-base">
                            {ch.label}
                          </div>
                          <div className="text-xs text-gray-500">{ch.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Шаг 2: Длительность */}
              <div>
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider block mb-3">
                  2. Период рекламной кампании:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {PERIODS.map((period) => (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`py-3 px-2 text-center rounded-2xl border-2 transition-all duration-200 relative ${
                        selectedPeriod === period.id
                          ? "border-brand-purple bg-white shadow-sm ring-1 ring-brand-purple text-gray-950 font-bold"
                          : "border-gray-200 bg-white/70 hover:border-gray-300 text-gray-700 font-medium"
                      }`}
                    >
                      <div className="text-xs sm:text-sm">{period.label}</div>
                      {period.discount && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-brand-pink bg-pink-50 px-2 py-0.5 rounded-full">
                          {period.discount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Правая колонка: результат и форма заявки */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Прогнозируемый результат:
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-gray-950 mb-1">
                  ~{estimatedReach.toLocaleString("ru-RU")}
                </div>
                <div className="text-xs text-gray-500 mb-6">
                  контактов с целевой аудиторией в Балаково и регионе
                </div>

                <div className="space-y-2 mb-6 p-4 rounded-xl bg-gray-50 text-xs sm:text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Выбрано каналов:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedChannels.length} шт.
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Разработка аудиоролика:</span>
                    <span className="font-semibold text-brand-pink">Включена</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Скидка за объем:</span>
                    <span className="font-semibold text-brand-purple">
                      {selectedPeriod === "3months"
                        ? "20%"
                        : selectedPeriod === "1month"
                        ? "10%"
                        : "По прайсу"}
                    </span>
                  </div>
                </div>
              </div>

              {isSubmitted ? (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
                  <div className="text-2xl mb-1">✅</div>
                  <div className="font-bold text-green-900 text-sm">
                    Медиаплан зафиксирован!
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    Специалист свяжется с вами в течение 15 минут для согласования графика.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="tel"
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink text-sm outline-none"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    className="w-full font-semibold"
                  >
                    Получить детальный медиаплан
                  </Button>
                  <div className="text-[11px] text-gray-400 text-center">
                    Бесплатный расчет • Без спама • Ответ за 15 минут
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const AdCalculator = memo(BaseAdCalculator);
export default AdCalculator;
