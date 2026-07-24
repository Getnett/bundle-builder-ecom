import type { FC } from "react";
import { RadioGroup } from "radix-ui";
import type { PlanOption } from "@/types";
import { useBundleStore } from "@/store/useBundleStore";
import PriceTag from "@/components/PriceTag";

interface PlanCardProps {
  plans: PlanOption[];
}

const PlanCard: FC<PlanCardProps> = ({ plans }) => {
  const value = useBundleStore(
    (state) => state.configuration.selectedPlanId,
  );
  const setPlan = useBundleStore((state) => state.actions.setPlan);

  return (
    <RadioGroup.Root
      value={value}
      onValueChange={setPlan}
      aria-label="Protection plan"
      className="grid gap-3 sm:grid-cols-2"
    >
      {plans.map((plan) => (
        <RadioGroup.Item
          key={plan.id}
          value={plan.id}
          className="flex cursor-pointer items-center justify-between gap-4 rounded-card border border-border bg-surface p-4 text-left transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 data-[state=checked]:border-selected data-[state=checked]:bg-selected-surface"
        >
          <span className="flex min-w-0 items-center gap-3">
            <img src={plan.iconUrl} alt="" className="size-step-icon" />
            <span className="flex min-w-0 flex-col">
              <span className="font-heading text-control font-bold text-foreground">
                {plan.name}{" "}
                <span className="text-brand">{plan.highlight}</span>
              </span>
              <span className="font-body text-caption text-foreground-subtle">
                {plan.description}
              </span>
            </span>
          </span>
          <PriceTag
            price={plan.price}
            compareAtPrice={plan.compareAtPrice}
            suffix="/mo"
            size="sm"
          />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default PlanCard;
