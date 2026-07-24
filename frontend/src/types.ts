export type BundleLayout = "sidebar" | "stacked";

export type {
  BundleCatalog,
  BundleConfiguration,
  BundleStepDefinition,
  PlanOption,
  PlanStepDefinition,
  ProductDefinition,
  ProductStepDefinition,
  ProductVariant,
  ShippingDefinition,
} from "@/schemas/catalog";

export interface ReviewLine {
  productId: string;
  sku: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  compareAtUnitPrice?: number;
  minQuantity: number;
  maxQuantity: number;
  freeLabel?: string;
}

export interface ReviewGroup {
  id: string;
  label: string;
  lines: ReviewLine[];
}

export interface CartSummary {
  subtotal: number;
  compareAtSubtotal: number;
  savings: number;
  monthlyPrice: number;
}
