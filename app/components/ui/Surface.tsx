import React, { ElementType, ComponentPropsWithRef, forwardRef, memo } from "react";

export interface BasePrimitiveProps {
  className?: string;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}

export type PolymorphicProps<E extends ElementType, P = {}> = P & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof P | "as">;

type PolymorphicComponent = <E extends ElementType = "div">(
  props: PolymorphicProps<E, BasePrimitiveProps> & {
    ref?: React.Ref<any>;
  }
) => React.ReactElement | null;

export const Surface = memo(
  forwardRef(function Surface<E extends ElementType = "div">(
    {
      as,
      href,
      target,
      rel,
      children,
      ...restProps
    }: PolymorphicProps<E, BasePrimitiveProps>,
    ref: React.Ref<any>
  ) {
    const Component = as || (href ? "a" : "div");
    const safeProps: Record<string, any> = {};

    if (Component === "a" && target === "_blank") {
      safeProps.rel = rel ? `${rel} noopener noreferrer` : "noopener noreferrer";
    }

    if (Component === "button") {
      safeProps.type = (restProps as any).type || "button";
    }

    return (
      <Component ref={ref} {...(restProps as any)} {...safeProps}>
        {children}
      </Component>
    );
  })
) as unknown as PolymorphicComponent;

export default Surface;
