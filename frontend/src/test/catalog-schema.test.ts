import { fetchBundleCatalog } from "@/api/catalog";
import { bundleCatalogSchema } from "@/schemas/catalog";
import type { BundleCatalog, ProductDefinition } from "@/types";
import { beforeAll, describe, expect, it } from "vitest";

let catalog: BundleCatalog;

const getFirstProduct = (value: BundleCatalog): ProductDefinition => {
  const product = value.steps.find((step) => step.kind === "products")
    ?.products[0];

  if (!product) {
    throw new Error("The test catalog must include a product.");
  }

  return product;
};

describe("bundleCatalogSchema", () => {
  beforeAll(async () => {
    catalog = await fetchBundleCatalog();
  });

  it("accepts the backend catalog", () => {
    expect(bundleCatalogSchema.safeParse(catalog).success).toBe(true);
  });

  it("rejects invalid product prices", () => {
    const invalidCatalog = structuredClone(catalog);
    getFirstProduct(invalidCatalog).unitPrice = -1;

    expect(bundleCatalogSchema.safeParse(invalidCatalog).success).toBe(false);
  });

  it("requires products to use either one SKU or variants", () => {
    const invalidCatalog = structuredClone(catalog);
    getFirstProduct(invalidCatalog).sku = "duplicate-product-sku";

    expect(bundleCatalogSchema.safeParse(invalidCatalog).success).toBe(false);
  });
});
