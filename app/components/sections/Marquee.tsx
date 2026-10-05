import React from "react";
import {
  DEFAULT_MARQUEE_DATA,
  type MarqueeSectionData,
} from "@/types/site-content";

interface MarqueeProps {
  initialData?: Partial<MarqueeSectionData>;
}

export default function Marquee({ initialData }: MarqueeProps) {
  const phrases =
    initialData?.phrases && initialData.phrases.length > 0
      ? initialData.phrases
      : DEFAULT_MARQUEE_DATA.phrases;

  return (
    <section
      id="marquee"
      aria-label="Направления деятельности"
      className="w-full border-y border-[#E0D8CB] bg-[#F3EFE8] py-9 overflow-hidden"
    >
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[17px] sm:text-[18px] font-semibold uppercase tracking-widest text-[#0A0A0A]">
        {/* Первый прогон */}
        {phrases.map((phrase, idx) => (
          <React.Fragment key={`p1-${idx}`}>
            <span>{phrase}</span>
            <span className="text-brand-pink font-bold">/</span>
          </React.Fragment>
        ))}

        {/* Дубликат для бесконечного плавного скролла */}
        {phrases.map((phrase, idx) => (
          <React.Fragment key={`p2-${idx}`}>
            <span>{phrase}</span>
            <span className="text-brand-pink font-bold">/</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

