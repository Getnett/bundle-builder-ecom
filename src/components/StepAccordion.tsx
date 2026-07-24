import type { FC } from "react";
import { Accordion } from "radix-ui";
import type {
  BundleConfiguration,
  BundleLayout,
  BundleStepDefinition,
  QuantityChangeHandler,
} from "@/types";
import StepAccordionItem from "@/components/StepAccordionItem";

interface StepAccordionProps {
  steps: BundleStepDefinition[];
  configuration: BundleConfiguration;
  layout: BundleLayout;
  onOpenStepChange: (stepId: string) => void;
  onActiveVariantChange: (productId: string, variantId: string) => void;
  onQuantityChange: QuantityChangeHandler;
  onPlanChange: (planId: string) => void;
  onReview: () => void;
}

const StepAccordion: FC<StepAccordionProps> = ({
  steps,
  configuration,
  layout,
  onOpenStepChange,
  onActiveVariantChange,
  onQuantityChange,
  onPlanChange,
  onReview,
}) => {
  return (
    <Accordion.Root
      type="single"
      collapsible
      value={configuration.openStepId}
      onValueChange={onOpenStepChange}
      className="w-full overflow-hidden rounded-panel border border-border bg-surface"
    >
      {steps.map((step, index) => (
        <StepAccordionItem
          key={step.id}
          step={step}
          stepCount={steps.length}
          nextStepId={steps[index + 1]?.id}
          configuration={configuration}
          layout={layout}
          onOpenStepChange={onOpenStepChange}
          onActiveVariantChange={onActiveVariantChange}
          onQuantityChange={onQuantityChange}
          onPlanChange={onPlanChange}
          onReview={onReview}
        />
      ))}
    </Accordion.Root>
  );
};

export default StepAccordion;
