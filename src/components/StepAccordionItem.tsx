import type { FC } from "react";
import { Accordion } from "radix-ui";
import { countSelectedProducts } from "@/bundle-state";
import type {
  BundleConfiguration,
  BundleLayout,
  BundleStepDefinition,
  QuantityChangeHandler,
} from "@/types";
import PlanCard from "@/components/PlanCard";
import ProductGrid from "@/components/ProductGrid";
import Button from "@/components/ui/Button";
import SolidChevron from "@/components/ui/SolidChevron";

interface StepAccordionItemProps {
  step: BundleStepDefinition;
  stepCount: number;
  nextStepId?: string;
  configuration: BundleConfiguration;
  layout: BundleLayout;
  onOpenStepChange: (stepId: string) => void;
  onActiveVariantChange: (productId: string, variantId: string) => void;
  onQuantityChange: QuantityChangeHandler;
  onPlanChange: (planId: string) => void;
  onReview: () => void;
}

const StepAccordionItem: FC<StepAccordionItemProps> = ({
  step,
  stepCount,
  nextStepId,
  configuration,
  layout,
  onOpenStepChange,
  onActiveVariantChange,
  onQuantityChange,
  onPlanChange,
  onReview,
}) => {
  const isOpen = configuration.openStepId === step.id;
  const selectedCount =
    step.kind === "products"
      ? countSelectedProducts(step.products, configuration)
      : Number(Boolean(configuration.selectedPlanId));

  const advance = () => {
    if (nextStepId) {
      onOpenStepChange(nextStepId);
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
              configuration={configuration}
              layout={layout}
              onActiveVariantChange={onActiveVariantChange}
              onQuantityChange={onQuantityChange}
            />
          ) : (
            <PlanCard
              plans={step.plans}
              value={configuration.selectedPlanId}
              onChange={onPlanChange}
            />
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
