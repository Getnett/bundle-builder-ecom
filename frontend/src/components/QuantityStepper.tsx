import type { FC } from "react";
import AppIcon from "@/components/ui/AppIcon";
import { twMerge } from "@/lib/twMerge";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "review" | "card" | "md";
  label?: string;
  plusVariant?: "filled" | "outline";
  bordered?: boolean;
}

const sizeStyles = {
  sm: {
    button: "size-stepper-button",
    icon: "size-2.5",
    value: "text-caption",
  },
  review: {
    button: "size-stepper-button",
    icon: "size-2.5",
    value: "text-body",
  },
  card: {
    button: "size-stepper-button",
    icon: "size-2.5",
    value: "text-control",
  },
  md: {
    button: "size-6",
    icon: "size-3",
    value: "text-control",
  },
} as const;

const QuantityStepper: FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 99,
  size = "md",
  label = "quantity",
  plusVariant = "filled",
  bordered = true,
}) => {
  const sizeStyle = sizeStyles[size];

  return (
    <div
      className="inline-flex items-center gap-1.5"
      role="group"
      aria-label={`${label} quantity`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${label} quantity`}
        className={twMerge(
          "inline-flex cursor-pointer items-center justify-center rounded-control bg-surface text-foreground-strong transition-colors disabled:cursor-not-allowed disabled:bg-disabled-surface disabled:text-foreground-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
          bordered
            ? "border border-border hover:border-border-strong"
            : "border-0",
          sizeStyle.button,
        )}
      >
        <AppIcon
          className={twMerge(sizeStyle.icon)}
          name="minus"
          strokeWidth={2.5}
        />
      </button>

      <span
        className={twMerge(
          "min-w-4 text-center font-body font-medium tabular-nums text-foreground-strong",
          sizeStyle.value,
        )}
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${label} quantity`}
        className={twMerge(
          "inline-flex cursor-pointer items-center justify-center rounded-control text-foreground-strong transition-colors disabled:cursor-not-allowed disabled:bg-disabled-surface disabled:text-foreground-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
          bordered
            ? twMerge(
                "border hover:border-border-strong",
                plusVariant === "outline"
                  ? "border-border bg-surface"
                  : "border-transparent bg-control-surface",
              )
            : twMerge(
                "border-0",
                plusVariant === "outline"
                  ? "bg-surface"
                  : "bg-control-surface",
              ),
          sizeStyle.button,
        )}
      >
        <AppIcon
          className={twMerge(sizeStyle.icon)}
          name="plus"
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
};

export default QuantityStepper;
