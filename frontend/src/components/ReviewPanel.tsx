import { forwardRef } from "react";
import type { FC, RefAttributes } from "react";
import { twMerge } from "@/lib/twMerge";
import type {
  BundleCatalog,
  BundleLayout,
  CartSummary,
} from "@/types";
import useBundleReview from "@/hooks/useBundleReview";
import ReviewSelections from "@/components/ReviewSelections";
import ReviewSummary from "@/components/ReviewSummary";

interface ReviewPanelProps {
  layout: BundleLayout;
  catalog: BundleCatalog;
  onCheckout?: (summary: CartSummary) => void;
}

const ReviewPanel: FC<
  ReviewPanelProps & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, ReviewPanelProps>(
  (
    {
      layout,
      catalog,
      onCheckout,
    },
    ref,
  ) => {
    const isStacked = layout === "stacked";
    const {
      checkout,
      reviewGroups,
      saveConfiguration,
      selectedPlan,
      statusMessage,
      summary,
    } = useBundleReview(catalog, onCheckout);

    return (
      <section
        ref={ref}
        tabIndex={-1}
        aria-labelledby="review-heading"
        className={twMerge(
          "w-full scroll-mt-6 rounded-panel bg-review-surface px-6 py-5 focus:outline-none",
          isStacked
            ? "xl:grid xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] xl:gap-12 xl:px-8 xl:py-7"
            : "lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)] lg:gap-12 lg:px-8 lg:py-7 xl:block xl:max-w-review-sidebar xl:px-6 xl:py-5",
        )}
        data-testid="review-panel"
      >
        <div className="flex min-w-0 flex-col gap-5">
          <header className="flex flex-col gap-1.5">
            <p className="font-body text-eyebrow font-medium tracking-eyebrow text-foreground-muted uppercase">
              Review
            </p>
            <h2
              id="review-heading"
              className="font-heading text-section font-semibold text-foreground"
            >
              {catalog.reviewTitle}
            </h2>
            <p className="font-body text-caption text-foreground-muted">
              {catalog.reviewSubtitle}
            </p>
          </header>
          <ReviewSelections
            groups={reviewGroups}
            plan={selectedPlan}
            shipping={catalog.shipping}
          />
        </div>
        <ReviewSummary
          layout={layout}
          guarantee={catalog.guarantee}
          summary={summary}
          statusMessage={statusMessage}
          onCheckout={checkout}
          onSaveForLater={saveConfiguration}
        />
      </section>
    );
  },
);

export default ReviewPanel;
