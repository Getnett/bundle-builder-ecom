import type { FC } from "react";
import { formatUSD } from "@/currency";
import { twMerge } from "@/lib/twMerge";
import type { BundleCatalog, BundleLayout, CartSummary } from "@/types";
import PriceTag from "@/components/PriceTag";
import Button from "@/components/ui/Button";

interface ReviewSummaryProps {
  layout: BundleLayout;
  guarantee: BundleCatalog["guarantee"];
  summary: CartSummary;
  statusMessage: string;
  onCheckout: () => void;
  onSaveForLater: () => void;
}

const ReviewSummary: FC<ReviewSummaryProps> = ({
  layout,
  guarantee,
  summary,
  statusMessage,
  onCheckout,
  onSaveForLater,
}) => {
  const isStacked = layout === "stacked";
  const financingBadge = (
    <span className="inline-flex rounded-badge bg-brand px-2 py-1 font-body text-caption font-medium text-on-brand">
      as low as {formatUSD(summary.monthlyPrice)}/mo
    </span>
  );
  const totalPrice = (
    <PriceTag
      price={summary.subtotal}
      compareAtPrice={summary.compareAtSubtotal}
      size="lg"
    />
  );

  return (
    <div
      className={twMerge(
        "flex flex-col gap-3",
        isStacked ? "mt-6 xl:mt-0" : "mt-6 lg:mt-0 xl:mt-3",
      )}
    >
      <div
        className={twMerge(
          "flex gap-4",
          isStacked
            ? "flex-col"
            : "items-end justify-between lg:flex-col lg:items-stretch xl:flex-row xl:items-end",
        )}
      >
        <div
          className={twMerge(
            "flex items-center gap-4",
            isStacked
              ? "sm:justify-center"
              : "lg:justify-center xl:justify-start",
          )}
        >
          <img
            src={guarantee.imageUrl}
            alt="100% Wyze satisfaction guarantee"
            className="size-guarantee shrink-0 object-contain"
          />
          <p
            className={twMerge(
              "font-body text-body text-foreground",
              !isStacked && "hidden lg:block xl:hidden",
            )}
          >
            <strong className="font-semibold">{guarantee.title}</strong>
            <br />
            <span className="text-foreground-muted">
              {guarantee.description}
            </span>
          </p>
        </div>
        <div
          className={twMerge(
            "flex items-end gap-3",
            isStacked
              ? "flex-wrap justify-between"
              : "flex-col lg:flex-row lg:flex-wrap lg:justify-between xl:flex-col xl:justify-start",
          )}
        >
          {financingBadge}
          {totalPrice}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-center font-heading text-caption font-semibold text-success">
          Congrats! You’re saving {formatUSD(summary.savings)} on your security
          bundle!
        </p>
        <Button size="md" fullWidth onClick={onCheckout}>
          Checkout
        </Button>
        <Button
          variant="link"
          className="self-center text-caption"
          onClick={onSaveForLater}
        >
          Save my system for later
        </Button>
        <p
          className="min-h-4 text-center font-body text-caption text-success"
          aria-live="polite"
          data-testid="status-message"
        >
          {statusMessage}
        </p>
      </div>
    </div>
  );
};

export default ReviewSummary;
