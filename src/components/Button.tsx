import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "primarySoft" | "secondary" | "danger";
export type ButtonSize = "sm" | "md" | "xs";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shadow?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-amber-500 text-white hover:bg-amber-600",
  primarySoft: "bg-amber-400 text-amber-900 hover:bg-amber-500",
  secondary:
    "border border-amber-300 bg-transparent text-amber-700 hover:bg-amber-100",
  danger:
    "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-sm font-semibold",
  md: "px-6 py-2.5 text-sm font-semibold",
  xs: "px-4 py-2 text-xs font-semibold",
};

const baseClass =
  "inline-flex items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-70";

export function Button({
  variant = "primary",
  size = "md",
  shadow = false,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const shadowCls =
    shadow && variant === "primary" && size === "sm" ? "shadow-sm" : "";
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass[variant]} ${sizeClass[size]} ${shadowCls} ${className}`.trim()}
      {...rest}
    />
  );
}
