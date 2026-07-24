import type { FC } from "react";
import { Minus, Plus } from "lucide-react";
import { twMerge } from "@/lib/twMerge";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  plusVariant?: "filled" | "outline";
}

const QuantityStepper: FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 99,
  size = "md",
  label = "quantity",
  plusVariant = "filled",
}) => {
  const buttonSize = size === "sm" ? "size-stepper-button" : "size-6";
  const iconSize = size === "sm" ? "size-2.5" : "size-3";
  const valueSize = size === "sm" ? "text-caption" : "text-control";

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
          "inline-flex cursor-pointer items-center justify-center rounded-control border border-border bg-surface text-foreground-strong transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:bg-disabled-surface disabled:text-foreground-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
          buttonSize,
        )}
      >
        <Minus className={twMerge(iconSize)} strokeWidth={2.5} />
      </button>

      <span
        className={twMerge(
          "min-w-4 text-center font-body font-medium tabular-nums text-foreground-strong",
          valueSize,
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
          "inline-flex cursor-pointer items-center justify-center rounded-control border text-foreground-strong transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:bg-disabled-surface disabled:text-foreground-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1",
          plusVariant === "outline"
            ? "border-border bg-surface"
            : "border-transparent bg-control-surface",
          buttonSize,
        )}
      >
        <Plus className={twMerge(iconSize)} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default QuantityStepper;
