"use client";

import { useState, memo, useCallback, useEffect } from "react";
import Image, { type ImageProps } from "next/image";

export function normalizeImageUrl(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  // Автоматическая трансформация ссылок Google Диска в прямой CDN поток картинки
  const driveMatch = trimmed.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/
  );
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return trimmed;
}

function BaseSafeImage({
  src,
  alt,
  className,
  width,
  height,
  ...props
}: ImageProps & { src: string }) {
  const resolvedSrc = normalizeImageUrl(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [resolvedSrc]);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  if (error || !resolvedSrc) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className || ""}`}
        style={{ width, height }}
      >
        Нет изображения
      </div>
    );
  }

  const isExternal =
    resolvedSrc.startsWith("http://") ||
    resolvedSrc.startsWith("https://") ||
    resolvedSrc.startsWith("data:");

  if (isExternal) {
    const isFill = (props as { fill?: boolean }).fill;
    const customStyle = (props.style as React.CSSProperties) || {};
    const defaultObjectFit = className?.includes("object-contain") ? "contain" : "cover";

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt={alt || ""}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        onError={handleError}
        className={`${className || ""} ${isFill ? "absolute inset-0 w-full h-full" : ""}`}
        style={{
          objectFit: customStyle.objectFit || defaultObjectFit,
          ...customStyle,
        }}
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt || ""}
      width={width}
      height={height}
      onError={handleError}
      className={className}
      {...props}
    />
  );
}

const SafeImage = memo(BaseSafeImage);
export default SafeImage;
