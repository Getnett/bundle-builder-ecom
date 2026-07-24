import { useMemo } from "react";
import {
  calculateSummary,
  selectPlan,
  selectReviewGroups,
} from "@/bundle-state";
import { useBundleStore } from "@/store/useBundleStore";
import type {
  BundleCatalog,
  CartSummary,
} from "@/types";

const formatCheckoutMessage = (summary: CartSummary) =>
  `Checkout ready for ${summary.subtotal.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })}.`;

const useBundleReview = (
  catalog: BundleCatalog,
  onCheckout?: (summary: CartSummary) => void,
) => {
  const configuration = useBundleStore(
    (state) => state.configuration,
  );
  const statusMessage = useBundleStore(
    (state) => state.statusMessage,
  );
  const saveConfiguration = useBundleStore(
    (state) => state.actions.saveConfiguration,
  );
  const setStatusMessage = useBundleStore(
    (state) => state.actions.setStatusMessage,
  );

  const reviewGroups = useMemo(
    () => selectReviewGroups(catalog, configuration),
    [catalog, configuration],
  );
  const summary = useMemo(
    () => calculateSummary(catalog, configuration),
    [catalog, configuration],
  );
  const selectedPlan = useMemo(
    () => selectPlan(catalog, configuration.selectedPlanId),
    [catalog, configuration.selectedPlanId],
  );

  const checkout = () => {
    onCheckout?.(summary);
    setStatusMessage(formatCheckoutMessage(summary));
  };

  return {
    checkout,
    reviewGroups,
    saveConfiguration,
    selectedPlan,
    statusMessage,
    summary,
  };
};

export default useBundleReview;
