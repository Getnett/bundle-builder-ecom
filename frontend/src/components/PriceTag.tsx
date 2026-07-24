import type { FC } from "react";
import { formatUSD } from "@/currency";
import { twMerge } from "@/lib/twMerge";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  freeLabel?: string;
  align?: "left" | "right";
  size?: "sm" | "md" | "lg";
  stacked?: boolean;
  suffix?: string;
  tone?: "brand" | "neutral" | "promotion";
}

const priceStyles = {
  sm: "text-caption",
  md: "text-control",
  lg: "text-total font-bold",
} as const;

const compareStyles = {
  sm: "text-caption",
  md: "text-body",
  lg: "text-control",
} as const;

const priceToneStyles = {
  brand: "text-brand",
  neutral: "text-foreground-muted",
  promotion: "text-foreground-muted",
} as const;

const PriceTag: FC<PriceTagProps> = ({
  price,
  compareAtPrice,
  freeLabel,
  align = "right",
  size = "md",
  stacked = false,
  suffix = "",
  tone = "brand",
}) => {
  const alignment =
    align === "right" ? "items-end text-right" : "items-start text-left";

  return (
    <div
      className={twMerge(
        "flex whitespace-nowrap",
        stacked ? "flex-col gap-0.5" : "flex-row items-baseline gap-1.5",
        alignment,
      )}
    >
      {compareAtPrice != null && compareAtPrice > price && (
        <span
          className={twMerge(
            "font-medium text-foreground-subtle line-through decoration-1 [text-decoration-skip-ink:none]",
            compareStyles[size],
            tone === "promotion" && "text-promotion",
          )}
        >
          {formatUSD(compareAtPrice)}
          {suffix}
        </span>
      )}
      <span
        className={twMerge(
          "font-semibold",
          priceStyles[size],
          priceToneStyles[tone],
        )}
        data-testid="active-price"
      >
        {freeLabel ?? formatUSD(price)}
        {!freeLabel && suffix}
      </span>
    </div>
  );
};

export default PriceTag;
