"use client";

import { useState, memo, useCallback } from "react";
import Image, { type ImageProps } from "next/image";

function BaseSafeImage({
  src,
  alt,
  className,
  width,
  height,
  ...props
}: ImageProps & { src: string }) {
  const [error, setError] = useState(false);

  const handleError = useCallback(() => {
    setError(true);
  }, []);

  if (error || !src) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className || ""}`}
        style={{ width, height }}
      >
        Нет изображения
      </div>
    );
  }

  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  if (isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ""}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        onError={handleError}
        className={className}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      src={src}
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
