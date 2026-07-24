import type { FC } from "react";
import { DEFAULT_STORAGE_KEY } from "@/bundle-state";
import { useBundleBuilder } from "@/hooks/useBundleBuilder";
import type {
  BundleCatalog,
  BundleLayout,
  CartSummary,
} from "@/types";
import ReviewPanel from "@/components/ReviewPanel";
import StepAccordion from "@/components/StepAccordion";

export interface BundleBuilderProps {
  catalog: BundleCatalog;
  layout?: BundleLayout;
  storageKey?: string;
  onCheckout?: (summary: CartSummary) => void;
}

const BundleBuilder: FC<BundleBuilderProps> = ({
  catalog,
  layout = "sidebar",
  storageKey = DEFAULT_STORAGE_KEY,
  onCheckout,
}) => {
  const {
    checkout,
    configuration,
    focusReview,
    reviewGroups,
    reviewRef,
    saveConfiguration,
    selectedPlan,
    setActiveVariant,
    setOpenStep,
    setPlan,
    setQuantity,
    statusMessage,
    summary,
  } = useBundleBuilder(catalog, storageKey, onCheckout);

  const content = (
    <>
      <StepAccordion
        steps={catalog.steps}
        configuration={configuration}
        layout={layout}
        onOpenStepChange={setOpenStep}
        onActiveVariantChange={setActiveVariant}
        onQuantityChange={setQuantity}
        onPlanChange={setPlan}
        onReview={focusReview}
      />
      <ReviewPanel
        ref={reviewRef}
        layout={layout}
        title={catalog.reviewTitle}
        subtitle={catalog.reviewSubtitle}
        groups={reviewGroups}
        plan={selectedPlan}
        shipping={catalog.shipping}
        guarantee={catalog.guarantee}
        summary={summary}
        statusMessage={statusMessage}
        onQuantityChange={setQuantity}
        onCheckout={checkout}
        onSaveForLater={saveConfiguration}
      />
    </>
  );

  return (
    <main className="mx-auto w-full max-w-bundle px-4 py-4 sm:px-6 sm:py-6">
      <h1 className="mb-5 font-heading text-hero font-bold tracking-tight text-foreground-strong lg:hidden">
        {catalog.title}
      </h1>

      {layout === "sidebar" ? (
        <div
          className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:items-start"
          data-layout="sidebar"
        >
          {content}
        </div>
      ) : (
        <div className="flex flex-col gap-6" data-layout="stacked">
          {content}
        </div>
      )}
    </main>
  );
};

export default BundleBuilder;
