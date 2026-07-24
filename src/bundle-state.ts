import type {
  BundleCatalog,
  BundleConfiguration,
  CartSummary,
  ProductDefinition,
  ReviewGroup,
  ReviewLine,
} from "@/types";

export const DEFAULT_STORAGE_KEY = "bundle-builder:configuration:v1";

export interface SkuConstraints {
  min: number;
  max: number;
}

export function getProductSkus(product: ProductDefinition): string[] {
  if (product.variants?.length) {
    return product.variants.map((variant) => variant.sku);
  }

  return [product.sku ?? product.id];
}

export function buildSkuIndex(
  catalog: BundleCatalog,
): Map<string, SkuConstraints> {
  return new Map(
    catalog.steps
      .filter((step) => step.kind === "products")
      .flatMap((step) =>
        step.products.flatMap((product) =>
          getProductSkus(product).map((sku) => [
            sku,
            {
              min: product.minQuantity ?? 0,
              max: product.maxQuantity ?? 99,
            },
          ] as const),
        ),
      ),
  );
}

export function getActiveSku(
  product: ProductDefinition,
  configuration: BundleConfiguration,
): string {
  if (!product.variants?.length) {
    return product.sku ?? product.id;
  }

  const activeVariantId =
    configuration.activeVariantByProduct[product.id] ??
    product.variants[0].id;

  return (
    product.variants.find((variant) => variant.id === activeVariantId)?.sku ??
    product.variants[0].sku
  );
}

export function getProductQuantity(
  product: ProductDefinition,
  configuration: BundleConfiguration,
): number {
  return configuration.quantitiesBySku[getActiveSku(product, configuration)] ?? 0;
}

export function isProductSelected(
  product: ProductDefinition,
  configuration: BundleConfiguration,
): boolean {
  return getProductSkus(product).some(
    (sku) => (configuration.quantitiesBySku[sku] ?? 0) > 0,
  );
}

export function countSelectedProducts(
  products: ProductDefinition[],
  configuration: BundleConfiguration,
): number {
  return products.filter((product) =>
    isProductSelected(product, configuration),
  ).length;
}

function productLines(
  product: ProductDefinition,
  configuration: BundleConfiguration,
): ReviewLine[] {
  const selectedVariants =
    product.variants?.filter(
      (variant) => (configuration.quantitiesBySku[variant.sku] ?? 0) > 0,
    ) ?? [];
  const showVariantLabel = selectedVariants.length > 1;

  if (product.variants?.length) {
    return selectedVariants.map((variant) => ({
      productId: product.id,
      sku: variant.sku,
      name: showVariantLabel
        ? `${product.name} (${variant.label})`
        : product.name,
      imageUrl: variant.imageUrl ?? product.imageUrl,
      quantity: configuration.quantitiesBySku[variant.sku] ?? 0,
      unitPrice: product.unitPrice,
      compareAtUnitPrice: product.compareAtUnitPrice,
      minQuantity: product.minQuantity ?? 0,
      maxQuantity: product.maxQuantity ?? 99,
      freeLabel: product.freeLabel,
    }));
  }

  const sku = product.sku ?? product.id;
  const quantity = configuration.quantitiesBySku[sku] ?? 0;
  if (quantity <= 0) return [];

  return [
    {
      productId: product.id,
      sku,
      name: product.name,
      imageUrl: product.imageUrl,
      quantity,
      unitPrice: product.unitPrice,
      compareAtUnitPrice: product.compareAtUnitPrice,
      minQuantity: product.minQuantity ?? 0,
      maxQuantity: product.maxQuantity ?? 99,
      freeLabel: product.freeLabel,
    },
  ];
}

export function selectReviewGroups(
  catalog: BundleCatalog,
  configuration: BundleConfiguration,
): ReviewGroup[] {
  return catalog.steps
    .filter((step) => step.kind === "products")
    .map((step) => ({
      id: step.id,
      label: step.reviewGroup,
      lines: step.products.flatMap((product) =>
        productLines(product, configuration),
      ),
    }))
    .filter((group) => group.lines.length > 0);
}

export function selectPlan(catalog: BundleCatalog, planId: string) {
  return catalog.steps
    .filter((step) => step.kind === "plan")
    .flatMap((step) => step.plans)
    .find((plan) => plan.id === planId);
}

export function calculateSummary(
  catalog: BundleCatalog,
  configuration: BundleConfiguration,
): CartSummary {
  const lines = selectReviewGroups(catalog, configuration).flatMap(
    (group) => group.lines,
  );
  const plan = selectPlan(catalog, configuration.selectedPlanId);

  const toCents = (amount: number) => Math.round(amount * 100);
  const productSubtotal = lines.reduce(
    (total, line) => total + toCents(line.unitPrice) * line.quantity,
    0,
  );
  const productCompareAt = lines.reduce(
    (total, line) =>
      total +
      toCents(line.compareAtUnitPrice ?? line.unitPrice) * line.quantity,
    0,
  );

  const subtotalCents =
    productSubtotal +
    toCents(plan?.price ?? 0) +
    toCents(catalog.shipping.price);
  const compareAtSubtotalCents =
    productCompareAt +
    toCents(plan?.compareAtPrice ?? plan?.price ?? 0) +
    toCents(
      catalog.shipping.contributesToSavings
        ? (catalog.shipping.compareAtPrice ?? catalog.shipping.price)
        : catalog.shipping.price,
    );

  return {
    subtotal: subtotalCents / 100,
    compareAtSubtotal: compareAtSubtotalCents / 100,
    savings: Math.max(0, compareAtSubtotalCents - subtotalCents) / 100,
    monthlyPrice: catalog.financing.monthlyPrice,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeConfiguration(
  catalog: BundleCatalog,
  value: unknown,
): BundleConfiguration {
  const fallback = catalog.initialConfiguration;
  if (!isRecord(value) || value.version !== 1) {
    return structuredClone(fallback);
  }

  const stepIds = new Set(catalog.steps.map((step) => step.id));
  const planIds = new Set(
    catalog.steps
      .filter((step) => step.kind === "plan")
      .flatMap((step) => step.plans.map((plan) => plan.id)),
  );
  const products = catalog.steps
    .filter((step) => step.kind === "products")
    .flatMap((step) => step.products);

  const rawQuantities = isRecord(value.quantitiesBySku)
    ? value.quantitiesBySku
    : {};
  const quantitiesBySku = Object.fromEntries(
    products.flatMap((product) =>
      getProductSkus(product).map((sku) => {
        const raw = rawQuantities[sku];
        const min = product.minQuantity ?? 0;
        const max = product.maxQuantity ?? 99;
        const fallbackQuantity = fallback.quantitiesBySku[sku] ?? min;
        const quantity =
          typeof raw === "number" && Number.isInteger(raw)
            ? Math.min(max, Math.max(min, raw))
            : fallbackQuantity;
        return [sku, quantity];
      }),
    ),
  );

  const rawActiveVariants = isRecord(value.activeVariantByProduct)
    ? value.activeVariantByProduct
    : {};
  const activeVariantByProduct = Object.fromEntries(
    products
      .filter((product) => product.variants?.length)
      .map((product) => {
        const fallbackVariant =
          fallback.activeVariantByProduct[product.id] ??
          product.variants?.[0]?.id ??
          "";
        const rawVariant = rawActiveVariants[product.id];
        const isValid =
          typeof rawVariant === "string" &&
          product?.variants?.some((variant) => variant.id === rawVariant);
        return [product.id, isValid ? rawVariant : fallbackVariant];
      }),
  );

  return {
    version: 1,
    openStepId:
      typeof value.openStepId === "string" &&
      (value.openStepId === "" || stepIds.has(value.openStepId))
        ? value.openStepId
        : fallback.openStepId,
    selectedPlanId:
      typeof value.selectedPlanId === "string" &&
      planIds.has(value.selectedPlanId)
        ? value.selectedPlanId
        : fallback.selectedPlanId,
    activeVariantByProduct,
    quantitiesBySku,
  };
}

export function readSavedConfiguration(
  catalog: BundleCatalog,
  storageKey: string,
): BundleConfiguration {
  if (typeof window === "undefined") {
    return structuredClone(catalog.initialConfiguration);
  }

  let serialized: string | null;
  try {
    serialized = window.localStorage.getItem(storageKey);
  } catch {
    return structuredClone(catalog.initialConfiguration);
  }
  if (!serialized) return structuredClone(catalog.initialConfiguration);

  try {
    return normalizeConfiguration(catalog, JSON.parse(serialized));
  } catch {
    return structuredClone(catalog.initialConfiguration);
  }
}
