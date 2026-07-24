import type { FC } from "react";
import { Accordion } from "radix-ui";
import type {
  BundleLayout,
  BundleStepDefinition,
} from "@/types";
import { useBundleStore } from "@/store/useBundleStore";
import StepAccordionItem from "@/components/StepAccordionItem";

interface StepAccordionProps {
  steps: BundleStepDefinition[];
  layout: BundleLayout;
  onReview: () => void;
}

const StepAccordion: FC<StepAccordionProps> = ({
  steps,
  layout,
  onReview,
}) => {
  const openStepId = useBundleStore(
    (state) => state.configuration.openStepId,
  );
  const setOpenStep = useBundleStore(
    (state) => state.actions.setOpenStep,
  );

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={openStepId}
      onValueChange={setOpenStep}
      className="w-full bg-surface"
    >
      {steps.map((step, index) => (
        <StepAccordionItem
          key={step.id}
          step={step}
          stepCount={steps.length}
          nextStepId={steps[index + 1]?.id}
          layout={layout}
          onReview={onReview}
        />
      ))}
    </Accordion.Root>
  );
};

export default StepAccordion;
