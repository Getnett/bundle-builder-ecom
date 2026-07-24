import type { BundleCatalog } from "@/types";
import type {
  BundleStore,
  BundleStoreApi,
} from "@/store/bundle-store";
import { createBundleStore } from "@/store/bundle-store";

let bundleStore: BundleStoreApi | null = null;
let activeStoreKey = "";

export const initializeBundleStore = (
  catalog: BundleCatalog,
  storageKey: string,
) => {
  const nextStoreKey = `${catalog.version}:${storageKey}`;
  if (bundleStore && nextStoreKey === activeStoreKey) return;

  bundleStore = createBundleStore({ catalog, storageKey });
  activeStoreKey = nextStoreKey;
};

export const useBundleStore = <T,>(
  selector: (store: BundleStore) => T,
): T => {
  if (!bundleStore) {
    throw new Error(
      "The bundle store must be initialized before it is used.",
    );
  }

  return bundleStore(selector);
};
