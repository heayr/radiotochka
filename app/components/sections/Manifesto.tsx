import React, { memo } from "react";

function BaseManifesto() {
  return (
    <section
      id="manifesto"
      className="w-full bg-[#F4F0EB] px-[20px] sm:px-[30px] lg:px-[60px] pt-16 sm:pt-24 pb-12 sm:pb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Левая колонка со списком городов и годом основания в стиле референса */}
        <div className="lg:col-span-3 flex flex-col gap-1.5 text-xs sm:text-[13px] font-medium tracking-wider text-[#7E7971] uppercase select-none">
          <span>SINCE 2004</span>
          <span>БАЛАКОВО</span>
          <span>САРАТОВ</span>
          <span>ВОЛЬСК</span>
        </div>

        {/* Правая колонка: Текст манифеста с элегантным затемнением завершения */}
        <div className="lg:col-span-9">
          <p className="text-2xl sm:text-4xl lg:text-[45px] font-bold text-[#0A0A0A] leading-[1.18] tracking-[-0.02em] max-w-4xl">
            Мы не делаем рекламу «ради галочки». Каждая кампания на радио и городских экранах строится под конкретные цифры и продажи,{" "}
            <span className="text-[#9E988F]">пока показатели бизнеса реально не пойдут вверх.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

const Manifesto = memo(BaseManifesto);
export default Manifesto;
