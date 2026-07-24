import type { ButtonHTMLAttributes, FC } from "react";
import { twMerge } from "@/lib/twMerge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "link";
  size?: "md" | "lg";
  fullWidth?: boolean;
}

const baseStyles =
  "inline-flex cursor-pointer items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const variantStyles = {
  primary:
    "rounded-control bg-checkout font-button font-bold text-on-brand hover:bg-checkout-hover",
  outline:
    "rounded-button border border-brand bg-transparent font-heading font-semibold text-brand hover:bg-brand-soft",
  link:
    "font-body italic text-foreground-muted underline underline-offset-2 hover:text-foreground",
} as const;

const sizeStyles = {
  md: "min-h-10 px-6 py-2 text-control",
  lg: "min-h-12 px-4 py-3 text-control",
} as const;

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        variant !== "link" && sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
    />
  );
};

export default Button;
