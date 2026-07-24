import type { FC } from "react";
import { RadioGroup } from "radix-ui";
import type { ProductVariant } from "@/types";

interface ColorSwatchesProps {
  variants: ProductVariant[];
  value: string;
  onChange: (variantId: string) => void;
  productName: string;
}

const ColorSwatches: FC<ColorSwatchesProps> = ({
  variants,
  value,
  onChange,
  productName,
}) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      className="flex flex-wrap items-center gap-1.5"
      aria-label={`${productName} color`}
    >
      {variants.map((variant) => (
        <RadioGroup.Item
          key={variant.id}
          value={variant.id}
          className="inline-flex h-variant-chip items-center justify-center gap-1 rounded-chip border border-swatch-border bg-surface px-1 font-body text-eyebrow font-medium text-foreground transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swatch-selected focus-visible:ring-offset-1 data-[state=checked]:border-swatch-selected data-[state=checked]:bg-swatch-selected-surface"
          aria-label={variant.label}
        >
          <img
            src={variant.swatchUrl}
            alt=""
            className="size-3 shrink-0 object-contain"
          />
          <span className="whitespace-nowrap">{variant.label}</span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default ColorSwatches;
