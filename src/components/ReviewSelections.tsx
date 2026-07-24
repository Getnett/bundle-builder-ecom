import type { FC } from "react";
import type {
  PlanOption,
  QuantityChangeHandler,
  ReviewGroup,
  ShippingDefinition,
} from "@/types";
import PriceTag from "@/components/PriceTag";
import ReviewLineItem from "@/components/ReviewLineItem";

interface ReviewGroupSectionProps {
  group: ReviewGroup;
  onQuantityChange: QuantityChangeHandler;
}

const ReviewGroupSection: FC<ReviewGroupSectionProps> = ({
  group,
  onQuantityChange,
}) => {
  return (
    <section
      aria-labelledby={`group-${group.id}`}
      className="border-t border-border py-4"
    >
      <h3
        id={`group-${group.id}`}
        className="mb-3 font-body text-caption tracking-wide text-foreground-faint uppercase"
      >
        {group.label}
      </h3>
      <div className="flex flex-col gap-3">
        {group.lines.map((line) => (
          <ReviewLineItem
            key={line.sku}
            line={line}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </section>
  );
};

interface ReviewSelectionsProps {
  groups: ReviewGroup[];
  plan?: PlanOption;
  shipping: ShippingDefinition;
  onQuantityChange: QuantityChangeHandler;
}

const ReviewSelections: FC<ReviewSelectionsProps> = ({
  groups,
  plan,
  shipping,
  onQuantityChange,
}) => {
  return (
    <div className="flex flex-col">
      {groups.map((group) => (
        <ReviewGroupSection
          key={group.id}
          group={group}
          onQuantityChange={onQuantityChange}
        />
      ))}

      {plan && (
        <section
          aria-labelledby="group-plan"
          className="border-t border-border py-4"
        >
          <h3
            id="group-plan"
            className="mb-3 font-body text-caption tracking-wide text-foreground-faint uppercase"
          >
            Plan
          </h3>
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 xl:grid-cols-[2.5rem_minmax(0,1fr)_4.5rem] 2xl:grid-cols-[2.5rem_minmax(0,1fr)_3.5rem]">
            <img
              src={plan.reviewIconUrl ?? plan.iconUrl}
              alt=""
              className="h-auto w-5 justify-self-center object-contain"
            />
            <p className="min-w-0 font-heading text-body font-bold text-foreground">
              {plan.name} <span className="text-brand">{plan.highlight}</span>
            </p>
            <PriceTag
              price={plan.price}
              compareAtPrice={plan.compareAtPrice}
              suffix="/mo"
              size="sm"
              stacked
            />
          </div>
        </section>
      )}

      <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 border-t border-border py-4 xl:grid-cols-[2.5rem_minmax(0,1fr)_4.5rem] 2xl:grid-cols-[2.5rem_minmax(0,1fr)_3.5rem]">
        <img
          src={shipping.iconUrl}
          alt=""
          className="size-step-icon justify-self-center"
        />
        <span className="font-heading text-body font-medium text-foreground">
          {shipping.name}
        </span>
        <PriceTag
          price={shipping.price}
          compareAtPrice={shipping.compareAtPrice}
          freeLabel={shipping.freeLabel}
          size="sm"
          stacked
        />
      </div>
    </div>
  );
};

export default ReviewSelections;
