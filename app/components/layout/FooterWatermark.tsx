import React, { memo } from "react";

interface FooterWatermarkProps {
  isVisible: boolean;
}

/**
 * Большой водяной знак «РАДИОТОЧКА» с кинематографичным скейлом и фирменным градиентом.
 * Вынесен из Footer.tsx для сохранения чистоты и компактности основного компонента.
 */
function BaseFooterWatermark({ isVisible }: FooterWatermarkProps) {
  return (
    <div
      className={`w-full max-w-[1720px] mx-auto overflow-hidden select-none pointer-events-none my-6 sm:my-12 2xl:my-16 px-4 flex justify-center transition-all duration-1000 ease-out delay-700 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <svg
        viewBox="0 0 1400 320"
        className="w-full max-h-[280px] 2xl:max-h-[320px] h-auto block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="footerRefinedGradient" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#EA5670" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#EA5670" stopOpacity="0.22" />
            <stop offset="75%" stopColor="#EA5670" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="250"
          textLength="1400"
          lengthAdjust="spacing"
          fill="url(#footerRefinedGradient)"
          fontSize="240"
          fontWeight="200"
          fontFamily="'Onest', -apple-system, BlinkMacSystemFont, sans-serif"
        >
          РАДИОТОЧКА
        </text>
      </svg>
    </div>
  );
}

export const FooterWatermark = memo(BaseFooterWatermark);
export default FooterWatermark;
