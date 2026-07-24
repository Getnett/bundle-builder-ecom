import type { FC } from "react";
import { Accordion } from "radix-ui";
import { countSelectedProducts } from "@/bundle-state";
import type {
  BundleLayout,
  BundleStepDefinition,
} from "@/types";
import { useBundleStore } from "@/store/useBundleStore";
import PlanCard from "@/components/PlanCard";
import ProductGrid from "@/components/ProductGrid";
import Button from "@/components/ui/Button";
import SolidChevron from "@/components/ui/SolidChevron";

interface StepAccordionItemProps {
  step: BundleStepDefinition;
  stepCount: number;
  nextStepId?: string;
  layout: BundleLayout;
  onReview: () => void;
}

const StepAccordionItem: FC<StepAccordionItemProps> = ({
  step,
  stepCount,
  nextStepId,
  layout,
  onReview,
}) => {
  const isOpen = useBundleStore(
    (state) => state.configuration.openStepId === step.id,
  );
  const selectedCount = useBundleStore((state) =>
    step.kind === "products"
      ? countSelectedProducts(step.products, state.configuration)
      : Number(Boolean(state.configuration.selectedPlanId)),
  );
  const setOpenStep = useBundleStore(
    (state) => state.actions.setOpenStep,
  );

  const advance = () => {
    if (nextStepId) {
      setOpenStep(nextStepId);
      return;
    }
    onReview();
  };

  return (
    <Accordion.Item
      value={step.id}
      className="bg-surface data-[state=open]:bg-review-surface [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border"
    >
      <div className="px-4 pt-3 sm:px-5">
        <p className="font-body text-eyebrow font-medium tracking-eyebrow text-foreground-muted uppercase">
          Step {step.stepNumber} of {stepCount}
        </p>
      </div>

      <Accordion.Header className="m-0">
        <Accordion.Trigger
          aria-label={`${step.title}, ${selectedCount} selected`}
          className="group flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <img
              src={step.iconUrl}
              alt=""
              className="size-step-icon shrink-0"
            />
            <span className="min-w-0 flex-1 truncate font-heading text-lg font-semibold text-foreground-strong sm:text-step">
              {step.title}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="whitespace-nowrap font-body text-body font-medium text-brand">
              {selectedCount} selected
            </span>
            <SolidChevron open={isOpen} />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content className="overflow-hidden px-4 pb-5 sm:px-5">
        <div className="flex flex-col items-center gap-4 border-t border-border pt-4">
          {step.kind === "products" ? (
            <ProductGrid
              products={step.products}
              layout={layout}
            />
          ) : (
            <PlanCard plans={step.plans} />
          )}
          <Button variant="outline" onClick={advance}>
            {step.ctaLabel}
          </Button>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default StepAccordionItem;
