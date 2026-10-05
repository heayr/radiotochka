"use client";

import Link from "next/link";
import React, {
  ElementType,
  ComponentPropsWithRef,
  forwardRef,
  memo,
  useCallback,
} from "react";

export interface BasePrimitiveProps {
  className?: string;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}

export interface ButtonCustomProps extends BasePrimitiveProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "fluid";
  loading?: boolean;
  ariaLabel?: string;
  asButton?: boolean;
}

export type PolymorphicProps<E extends ElementType, P = {}> = P & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof P | "as">;

const variantStyles: Record<NonNullable<ButtonCustomProps["variant"]>, string> = {
  primary:
    "bg-dark text-white border-2 border-dark hover:bg-brand-pink hover:text-white hover:border-brand-pink shadow-sm",
  secondary:
    "bg-gradient-to-r from-brand-pink to-brand-purple text-white border-2 border-transparent hover:opacity-90 shadow-sm",
  outline:
    "bg-transparent text-black border-2 border-black hover:bg-brand-pink hover:border-brand-pink hover:text-white shadow-sm",
  ghost:
    "bg-transparent text-black border-2 border-transparent hover:bg-pink-50 hover:text-brand-pink",
};

const sizeStyles: Record<NonNullable<ButtonCustomProps["size"]>, string> = {
  sm: "px-4 py-2 text-fluid-sm rounded-lg",
  md: "px-6 py-3 text-fluid-base rounded-xl",
  lg: "px-8 py-4 text-fluid-lg rounded-2xl",
  fluid: "px-fluid-btn-x py-fluid-btn-y text-fluid-base rounded-xl",
};

const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";
const loadingStyles = "cursor-wait";

/** Простой SVG-спиннер (memoized atomic primitive) */
const Spinner = memo(function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-5 w-5 ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
});

type PolymorphicButtonComponent = <E extends ElementType = "button">(
  props: PolymorphicProps<E, ButtonCustomProps> & {
    ref?: React.Ref<any>;
  }
) => React.ReactElement | null;

const BaseButton = forwardRef(function Button<E extends ElementType = "button">(
  {
    as,
    href,
    asButton = false,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    type = "button",
    target,
    rel,
    className = "",
    ariaLabel,
    children,
    onClick,
    ...restProps
  }: PolymorphicProps<E, ButtonCustomProps>,
  ref: React.Ref<any>
) {
  // Определяем тег без структурного дублирования JSX-дерева
  const isLink = Boolean(href && !asButton);
  const Component: ElementType = as || (isLink ? (href?.startsWith("http") || href?.startsWith("tel:") || href?.startsWith("mailto:") ? "a" : Link) : "button");

  const baseClasses = [
    "flex items-center justify-center gap-2",
    "font-medium",
    "transition-all duration-300 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2",
    "active:scale-[0.97]",
    variantStyles[variant],
    sizeStyles[size],
    disabled || loading ? disabledStyles : "",
    loading ? loadingStyles : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    },
    [disabled, loading, onClick]
  );

  // Формируем безопасные свойства
  const safeProps: Record<string, any> = {
    className: baseClasses,
    onClick: handleClick,
  };

  if (ariaLabel) {
    safeProps["aria-label"] = ariaLabel;
  }

  if (isLink) {
    safeProps.href = disabled ? "#" : href;
    if (disabled) {
      safeProps["aria-disabled"] = true;
      safeProps.tabIndex = -1;
    }
    if (target === "_blank") {
      safeProps.target = "_blank";
      safeProps.rel = rel ? `${rel} noopener noreferrer` : "noopener noreferrer";
    }
  } else {
    safeProps.type = (restProps as any).type || type || "button";
    safeProps.disabled = disabled || loading;
    if (loading) {
      safeProps["aria-busy"] = true;
    }
  }

  // Инвариант: safeProps раскрываются строго ПОСЛЕДНИМИ, единое дерево JSX
  return (
    <Component ref={ref} {...(restProps as any)} {...safeProps}>
      {loading && <Spinner />}
      {children}
    </Component>
  );
});

const Button = memo(BaseButton) as unknown as PolymorphicButtonComponent;

export default Button;
