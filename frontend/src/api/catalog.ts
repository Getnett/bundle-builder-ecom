import type { BundleCatalog } from "@/types";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? ""
).replace(/\/$/, "");

const isBundleCatalog = (value: unknown): value is BundleCatalog => {
  if (typeof value !== "object" || value === null) return false;
  const catalog = value as Partial<BundleCatalog>;
  return (
    catalog.version === 1 &&
    Array.isArray(catalog.steps) &&
    typeof catalog.initialConfiguration === "object"
  );
};

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

  const catalog: unknown = await response.json();
  if (!isBundleCatalog(catalog)) {
    throw new Error("The catalog response has an invalid format.");
  }

  return catalog;
};
