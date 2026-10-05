export default function Marquee() {
  return (
    <section
      id="marquee"
      aria-label="Направления деятельности"
      className="w-full border-y border-[#E0D8CB] bg-[#F3EFE8] py-9 overflow-hidden"
    >
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[17px] sm:text-[18px] font-semibold uppercase tracking-widest text-[#0A0A0A]">
        <span>РАДИОРЕКЛАМА</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>104.7 FM ДОРОЖНОЕ РАДИО</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>НАРУЖНАЯ РЕКЛАМА</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>МЕДИАФАСАДЫ В БАЛАКОВО</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>98.4 FM НАШЕ РАДИО</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>АУДИОРОЛИКИ ПОД КЛЮЧ</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>ШИРОКОФОРМАТНАЯ ПЕЧАТЬ</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>БИЛБОРДЫ И СИТИ-ФОРМАТЫ</span>
        <span className="text-brand-pink font-bold">/</span>

        {/* Дубликат для бесконечного плавного скролла */}
        <span>РАДИОРЕКЛАМА</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>104.7 FM ДОРОЖНОЕ РАДИО</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>НАРУЖНАЯ РЕКЛАМА</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>МЕДИАФАСАДЫ В БАЛАКОВО</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>98.4 FM НАШЕ РАДИО</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>АУДИОРОЛИКИ ПОД КЛЮЧ</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>ШИРОКОФОРМАТНАЯ ПЕЧАТЬ</span>
        <span className="text-brand-pink font-bold">/</span>
        <span>БИЛБОРДЫ И СИТИ-ФОРМАТЫ</span>
        <span className="text-brand-pink font-bold">/</span>
      </div>
    </section>
  );
}
