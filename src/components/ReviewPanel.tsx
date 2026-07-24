import { forwardRef } from "react";
import type { FC, RefAttributes } from "react";
import { twMerge } from "@/lib/twMerge";
import type {
  BundleCatalog,
  BundleLayout,
  CartSummary,
  PlanOption,
  QuantityChangeHandler,
  ReviewGroup,
  ShippingDefinition,
} from "@/types";
import ReviewSelections from "@/components/ReviewSelections";
import ReviewSummary from "@/components/ReviewSummary";

interface ReviewPanelProps {
  layout: BundleLayout;
  title: string;
  subtitle: string;
  groups: ReviewGroup[];
  plan?: PlanOption;
  shipping: ShippingDefinition;
  guarantee: BundleCatalog["guarantee"];
  summary: CartSummary;
  statusMessage: string;
  onQuantityChange: QuantityChangeHandler;
  onCheckout: () => void;
  onSaveForLater: () => void;
}

const ReviewPanel: FC<
  ReviewPanelProps & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, ReviewPanelProps>(
  (
    {
      layout,
      title,
      subtitle,
      groups,
      plan,
      shipping,
      guarantee,
      summary,
      statusMessage,
      onQuantityChange,
      onCheckout,
      onSaveForLater,
    },
    ref,
  ) => {
    const isStacked = layout === "stacked";

    return (
      <section
        ref={ref}
        tabIndex={-1}
        aria-labelledby="review-heading"
        className={twMerge(
          "w-full scroll-mt-6 rounded-panel bg-review-surface px-6 py-5 focus:outline-none",
          isStacked
            ? "xl:grid xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] xl:gap-12 xl:px-8 xl:py-7"
            : "xl:grid xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)] xl:gap-12 xl:px-8 xl:py-7 2xl:block 2xl:max-w-review-sidebar 2xl:px-6 2xl:py-5",
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
              {title}
            </h2>
            <p className="font-body text-caption text-foreground-muted">
              {subtitle}
            </p>
          </header>
          <ReviewSelections
            groups={groups}
            plan={plan}
            shipping={shipping}
            onQuantityChange={onQuantityChange}
          />
        </div>
        <ReviewSummary
          layout={layout}
          guarantee={guarantee}
          summary={summary}
          statusMessage={statusMessage}
          onCheckout={onCheckout}
          onSaveForLater={onSaveForLater}
        />
      </section>
    );
  },
);

export default ReviewPanel;
