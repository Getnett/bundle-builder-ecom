import { useMemo, useRef, useState } from "react";
import {
  calculateSummary,
  readSavedConfiguration,
  selectPlan,
  selectReviewGroups,
} from "@/bundle-state";
import type {
  BundleCatalog,
  BundleConfiguration,
  CartSummary,
  QuantityChangeHandler,
} from "@/types";

export const useBundleBuilder = (
  catalog: BundleCatalog,
  storageKey: string,
  onCheckout?: (summary: CartSummary) => void,
) => {
  const [configuration, setConfiguration] = useState<BundleConfiguration>(() =>
    readSavedConfiguration(catalog, storageKey),
  );
  const [statusMessage, setStatusMessage] = useState("");
  const reviewRef = useRef<HTMLElement>(null);

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

  const updateConfiguration = (
    update: (current: BundleConfiguration) => BundleConfiguration,
  ) => {
    setStatusMessage("");
    setConfiguration(update);
  };

  const setOpenStep = (openStepId: string) => {
    updateConfiguration((current) => ({ ...current, openStepId }));
  };

  const setActiveVariant = (productId: string, variantId: string) => {
    updateConfiguration((current) => ({
      ...current,
      activeVariantByProduct: {
        ...current.activeVariantByProduct,
        [productId]: variantId,
      },
    }));
  };

  const setQuantity: QuantityChangeHandler = (
    sku,
    quantity,
    minQuantity = 0,
    maxQuantity = 99,
  ) => {
    updateConfiguration((current) => ({
      ...current,
      quantitiesBySku: {
        ...current.quantitiesBySku,
        [sku]: Math.min(maxQuantity, Math.max(minQuantity, quantity)),
      },
    }));
  };

  const setPlan = (selectedPlanId: string) => {
    updateConfiguration((current) => ({ ...current, selectedPlanId }));
  };

  const focusReview = () => {
    setOpenStep("");
    requestAnimationFrame(() => {
      reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      reviewRef.current?.focus({ preventScroll: true });
    });
  };

  const saveConfiguration = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(configuration));
    setStatusMessage("Your system has been saved for your next visit.");
  };

  const checkout = () => {
    onCheckout?.(summary);
    setStatusMessage(
      `Checkout ready for ${summary.subtotal.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })}.`,
    );
  };

  return {
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
  };
};
