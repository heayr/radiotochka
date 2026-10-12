"use client";

import Link from "next/link";
import React, {
  ComponentPropsWithRef,
  ElementType,
  forwardRef,
  memo,
  useCallback,
} from "react";

export interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "fluid";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithRef<"button">, keyof ButtonBaseProps | "href"> & {
    as?: "button";
    href?: never;
    asButton?: true;
  };

export type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithRef<typeof Link>, keyof ButtonBaseProps | "href"> & {
    href: string;
    as?: never;
    asButton?: false;
  };

export type ButtonAsCustom<E extends ElementType> = ButtonBaseProps & {
  as: E;
} & Omit<ComponentPropsWithRef<E>, keyof ButtonBaseProps | "as">;

export type ButtonProps<E extends ElementType = "button"> =
  | ButtonAsButton
  | ButtonAsLink
  | ButtonAsCustom<E>;

// Алиас для обратной совместимости
export type ButtonCustomProps = ButtonBaseProps & {
  asButton?: boolean;
};

export interface ButtonComponent {
  <E extends ElementType>(
    props: ButtonAsCustom<E>
  ): React.ReactElement | null;
  (props: ButtonAsLink): React.ReactElement | null;
  (props: ButtonAsButton): React.ReactElement | null;
}

const variantStyles: Record<NonNullable<ButtonBaseProps["variant"]>, string> = {
  primary:
    "bg-dark text-white border-2 border-dark hover:bg-brand-pink hover:text-white hover:border-brand-pink shadow-sm",
  secondary:
    "bg-gradient-to-r from-brand-pink to-brand-purple text-white border-2 border-transparent hover:opacity-90 shadow-sm",
  outline:
    "bg-transparent text-black border-2 border-black hover:bg-brand-pink hover:border-brand-pink hover:text-white shadow-sm",
  ghost:
    "bg-transparent text-black border-2 border-transparent hover:bg-pink-50 hover:text-brand-pink",
};

const sizeStyles: Record<NonNullable<ButtonBaseProps["size"]>, string> = {
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

const BaseButton = forwardRef<
  HTMLElement,
  ButtonBaseProps & {
    as?: ElementType;
    href?: string;
    asButton?: boolean;
    type?: "button" | "submit" | "reset";
    target?: string;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
  }
>(function Button(props, ref) {
  const {
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
  } = props;

  const baseClasses = [
    "inline-flex items-center justify-center gap-2",
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
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    },
    [disabled, loading, onClick]
  );

  const content = (
    <>
      {loading && <Spinner />}
      {children}
    </>
  );

  // 1. Кастомный элемент через prop `as`
  if (as) {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={baseClasses}
        onClick={handleClick}
        aria-label={ariaLabel}
        {...restProps}
      >
        {content}
      </Component>
    );
  }

  // 2. Ссылка (Next.js Link для внутренних путей, нативный <a> для внешних)
  if (href && !asButton) {
    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    const linkHref = disabled ? "#" : href;
    const linkRel =
      target === "_blank"
        ? rel
          ? `${rel} noopener noreferrer`
          : "noopener noreferrer"
        : rel;

    if (isExternal) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={linkHref}
          className={baseClasses}
          onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
          aria-label={ariaLabel}
          aria-disabled={disabled ? true : undefined}
          tabIndex={disabled ? -1 : undefined}
          target={target}
          rel={linkRel}
          {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={linkHref}
        className={baseClasses}
        onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
        aria-label={ariaLabel}
        aria-disabled={disabled ? true : undefined}
        tabIndex={disabled ? -1 : undefined}
        target={target}
        rel={linkRel}
        {...(restProps as Omit<
          React.ComponentPropsWithoutRef<typeof Link>,
          "href"
        >)}
      >
        {content}
      </Link>
    );
  }

  // 3. Обычная кнопка по умолчанию
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={baseClasses}
      onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading ? true : undefined}
      {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

export const Button = memo(BaseButton) as unknown as ButtonComponent;

export default Button;
