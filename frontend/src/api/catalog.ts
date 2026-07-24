import { bundleCatalogSchema } from "@/schemas/catalog";
import type { BundleCatalog } from "@/types";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? ""
).replace(/\/$/, "");

export const fetchBundleCatalog = async (
  signal?: AbortSignal,
): Promise<BundleCatalog> => {
  const response = await fetch(`${apiBaseUrl}/api/catalog`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Catalog request failed (${response.status}).`);
  }

  const result = bundleCatalogSchema.safeParse(await response.json());
  if (!result.success) {
    throw new Error("The catalog response has an invalid format.", {
      cause: result.error,
    });
  }

  return result.data;
};
