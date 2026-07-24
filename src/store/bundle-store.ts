import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  buildSkuIndex,
  readSavedConfiguration,
} from "@/bundle-state";
import type {
  BundleCatalog,
  BundleConfiguration,
} from "@/types";

export interface BundleStoreState {
  configuration: BundleConfiguration;
  statusMessage: string;
}

export interface BundleStoreActions {
  setOpenStep: (stepId: string) => void;
  setActiveVariant: (productId: string, variantId: string) => void;
  setQuantity: (sku: string, quantity: number) => void;
  setPlan: (planId: string) => void;
  saveConfiguration: () => void;
  setStatusMessage: (message: string) => void;
  clearStatusMessage: () => void;
}

export type BundleStore = BundleStoreState & {
  actions: BundleStoreActions;
};
export type BundleStoreApi = ReturnType<typeof createBundleStore>;

export interface CreateBundleStoreOptions {
  catalog: BundleCatalog;
  storageKey: string;
}

export const createBundleStore = ({
  catalog,
  storageKey,
}: CreateBundleStoreOptions) => {
  const stepIds = new Set(catalog.steps.map((step) => step.id));
  const planIds = new Set(
    catalog.steps
      .filter((step) => step.kind === "plan")
      .flatMap((step) => step.plans.map((plan) => plan.id)),
  );
  const variantsByProduct = new Map(
    catalog.steps
      .filter((step) => step.kind === "products")
      .flatMap((step) => step.products)
      .filter((product) => product.variants?.length)
      .map((product) => [
        product.id,
        new Set(product.variants?.map((variant) => variant.id)),
      ]),
  );
  const skuIndex = buildSkuIndex(catalog);

  return create<BundleStore>()(
    immer((set, get) => {
      const updateConfiguration = (
        update: (current: BundleConfiguration) => void,
      ) => {
        set((state) => {
          update(state.configuration);
          state.statusMessage = "";
        });
      };

      return {
        configuration: readSavedConfiguration(catalog, storageKey),
        statusMessage: "",
        actions: {
          setOpenStep: (stepId) => {
            if (stepId !== "" && !stepIds.has(stepId)) return;
            updateConfiguration((current) => {
              current.openStepId = stepId;
            });
          },
          setActiveVariant: (productId, variantId) => {
            if (!variantsByProduct.get(productId)?.has(variantId)) return;
            updateConfiguration((current) => {
              current.activeVariantByProduct[productId] = variantId;
            });
          },
          setQuantity: (sku, quantity) => {
            const constraints = skuIndex.get(sku);
            if (!constraints || !Number.isFinite(quantity)) return;
            const normalized = Math.min(
              constraints.max,
              Math.max(constraints.min, Math.trunc(quantity)),
            );
            updateConfiguration((current) => {
              current.quantitiesBySku[sku] = normalized;
            });
          },
          setPlan: (planId) => {
            if (!planIds.has(planId)) return;
            updateConfiguration((current) => {
              current.selectedPlanId = planId;
            });
          },
          saveConfiguration: () => {
            try {
              if (typeof window === "undefined") {
                throw new Error("Local storage is unavailable.");
              }
              window.localStorage.setItem(
                storageKey,
                JSON.stringify(get().configuration),
              );
              set((state) => {
                state.statusMessage =
                  "Your system has been saved for your next visit.";
              });
            } catch {
              set((state) => {
                state.statusMessage =
                  "We couldn’t save your system. Please try again.";
              });
            }
          },
          setStatusMessage: (statusMessage) => {
            set((state) => {
              state.statusMessage = statusMessage;
            });
          },
          clearStatusMessage: () => {
            set((state) => {
              state.statusMessage = "";
            });
          },
        },
      };
    }),
  );
};
