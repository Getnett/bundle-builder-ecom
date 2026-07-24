import type { FC } from "react";
import type { QuantityChangeHandler, ReviewLine } from "@/types";
import PriceTag from "@/components/PriceTag";
import QuantityStepper from "@/components/QuantityStepper";

interface ReviewLineItemProps {
  line: ReviewLine;
  onQuantityChange: QuantityChangeHandler;
}

const ReviewLineItem: FC<ReviewLineItemProps> = ({
  line,
  onQuantityChange,
}) => {
  return (
    <div
      className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto_3.5rem] items-center gap-3 xl:grid-cols-[2.5rem_minmax(0,1fr)_auto_4.5rem] 2xl:grid-cols-[2.5rem_minmax(0,1fr)_auto_3.5rem]"
      data-testid={`review-line-${line.sku}`}
    >
      <img
        src={line.imageUrl}
        alt=""
        className="size-review-thumbnail rounded-image bg-surface object-contain"
      />
      <p className="min-w-0 font-heading text-caption font-medium leading-tight text-foreground-strong">
        {line.name}
      </p>
      <QuantityStepper
        value={line.quantity}
        onChange={(quantity) =>
          onQuantityChange(
            line.sku,
            quantity,
            line.minQuantity,
            line.maxQuantity,
          )
        }
        min={line.minQuantity}
        max={line.maxQuantity}
        label={line.name}
        size="sm"
      />
      <div className="w-full justify-self-end">
        <PriceTag
          price={line.unitPrice * line.quantity}
          compareAtPrice={
            line.compareAtUnitPrice == null
              ? undefined
              : line.compareAtUnitPrice * line.quantity
          }
          freeLabel={line.freeLabel}
          size="sm"
          stacked
        />
      </div>
    </div>
  );
};

export default ReviewLineItem;
