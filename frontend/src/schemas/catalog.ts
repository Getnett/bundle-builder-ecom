import { z } from "zod/mini";

const requiredString = z.string().check(z.minLength(1));
const money = z.number().check(z.minimum(0));
const quantity = z.int().check(z.minimum(0));

export const productVariantSchema = z.object({
  id: requiredString,
  sku: requiredString,
  label: requiredString,
  tone: z.enum(["white", "grey", "black"]),
  swatchUrl: requiredString,
  imageUrl: z.optional(requiredString),
});

export const productDefinitionSchema = z
  .object({
    id: requiredString,
    sku: z.optional(requiredString),
    name: requiredString,
    description: requiredString,
    desktopDescriptionLines: z.optional(z.array(z.string())),
    imageUrl: requiredString,
    learnMoreUrl: z.optional(requiredString),
    badge: z.optional(requiredString),
    unitPrice: money,
    compareAtUnitPrice: z.optional(money),
    minQuantity: z.optional(quantity),
    maxQuantity: z.optional(quantity),
    freeLabel: z.optional(requiredString),
    variants: z.optional(
      z.array(productVariantSchema).check(z.minLength(1)),
    ),
  })
  .check(
    z.refine(
      (product) =>
        Boolean(product.sku) !== Boolean(product.variants?.length),
      {
        error: "A product must define either one SKU or variants.",
        path: ["sku"],
      },
    ),
    z.refine(
      (product) =>
        product.minQuantity === undefined ||
        product.maxQuantity === undefined ||
        product.minQuantity <= product.maxQuantity,
      {
        error: "Minimum quantity cannot exceed maximum quantity.",
        path: ["minQuantity"],
      },
    ),
  );

const stepBaseSchema = z.object({
  id: requiredString,
  stepNumber: z.int().check(z.minimum(1)),
  title: requiredString,
  iconUrl: requiredString,
  reviewGroup: requiredString,
  ctaLabel: requiredString,
});

export const productStepDefinitionSchema = z.extend(stepBaseSchema, {
  kind: z.literal("products"),
  products: z.array(productDefinitionSchema).check(z.minLength(1)),
});

export const planOptionSchema = z.object({
  id: requiredString,
  iconUrl: requiredString,
  reviewIconUrl: z.optional(requiredString),
  name: requiredString,
  highlight: requiredString,
  price: money,
  compareAtPrice: z.optional(money),
  description: requiredString,
});

export const planStepDefinitionSchema = z.extend(stepBaseSchema, {
  kind: z.literal("plan"),
  plans: z.array(planOptionSchema).check(z.minLength(1)),
});

export const bundleStepDefinitionSchema = z.discriminatedUnion("kind", [
  productStepDefinitionSchema,
  planStepDefinitionSchema,
]);

export const shippingDefinitionSchema = z.object({
  id: requiredString,
  name: requiredString,
  iconUrl: requiredString,
  price: money,
  compareAtPrice: z.optional(money),
  freeLabel: z.optional(requiredString),
  contributesToSavings: z.boolean(),
});

export const bundleConfigurationSchema = z.object({
  version: z.literal(1),
  openStepId: z.string(),
  selectedPlanId: requiredString,
  activeVariantByProduct: z.record(z.string(), z.string()),
  quantitiesBySku: z.record(z.string(), quantity),
});

export const bundleCatalogSchema = z.object({
  version: z.literal(1),
  title: requiredString,
  reviewTitle: requiredString,
  reviewSubtitle: requiredString,
  steps: z.array(bundleStepDefinitionSchema).check(z.minLength(1)),
  shipping: shippingDefinitionSchema,
  guarantee: z.object({
    imageUrl: requiredString,
    title: requiredString,
    description: requiredString,
  }),
  financing: z.object({
    monthlyPrice: money,
  }),
  initialConfiguration: bundleConfigurationSchema,
});

export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductDefinition = z.infer<typeof productDefinitionSchema>;
export type ProductStepDefinition = z.infer<
  typeof productStepDefinitionSchema
>;
export type PlanOption = z.infer<typeof planOptionSchema>;
export type PlanStepDefinition = z.infer<typeof planStepDefinitionSchema>;
export type BundleStepDefinition = z.infer<
  typeof bundleStepDefinitionSchema
>;
export type ShippingDefinition = z.infer<typeof shippingDefinitionSchema>;
export type BundleConfiguration = z.infer<
  typeof bundleConfigurationSchema
>;
export type BundleCatalog = z.infer<typeof bundleCatalogSchema>;
