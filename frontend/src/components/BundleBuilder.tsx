import { useRef } from "react";
import type { FC } from "react";
import { DEFAULT_STORAGE_KEY } from "@/bundle-state";
import { getPreferredScrollBehavior } from "@/lib/motion";
import {
  initializeBundleStore,
  useBundleStore,
} from "@/store/useBundleStore";
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
  const storeKey = `${catalog.version}:${storageKey}`;
  initializeBundleStore(catalog, storageKey);

  return (
    <BundleBuilderContent
      key={storeKey}
      catalog={catalog}
      layout={layout}
      onCheckout={onCheckout}
    />
  );
};

interface BundleBuilderContentProps {
  catalog: BundleCatalog;
  layout: BundleLayout;
  onCheckout?: (summary: CartSummary) => void;
}

const BundleBuilderContent: FC<BundleBuilderContentProps> = ({
  catalog,
  layout,
  onCheckout,
}) => {
  const reviewRef = useRef<HTMLElement>(null);
  const setOpenStep = useBundleStore(
    (state) => state.actions.setOpenStep,
  );
  const focusReview = () => {
    setOpenStep("");
    requestAnimationFrame(() => {
      reviewRef.current?.scrollIntoView({
        behavior: getPreferredScrollBehavior(),
        block: "start",
      });
      reviewRef.current?.focus({ preventScroll: true });
    });
  };
  const content = (
    <>
      <StepAccordion
        steps={catalog.steps}
        layout={layout}
        onReview={focusReview}
      />
      <ReviewPanel
        ref={reviewRef}
        layout={layout}
        catalog={catalog}
        onCheckout={onCheckout}
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
          className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_var(--container-review-sidebar)] xl:items-start"
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
