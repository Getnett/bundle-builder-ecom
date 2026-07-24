export type BundleLayout = "sidebar" | "stacked";

export interface ProductVariant {
  id: string;
  sku: string;
  label: string;
  tone: "white" | "grey" | "black";
  swatchUrl: string;
  imageUrl?: string;
}

export interface ProductDefinition {
  id: string;
  sku?: string;
  name: string;
  description: string;
  desktopDescriptionLines?: string[];
  imageUrl: string;
  learnMoreUrl?: string;
  badge?: string;
  unitPrice: number;
  compareAtUnitPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  freeLabel?: string;
  variants?: ProductVariant[];
}

export interface ProductStepDefinition {
  id: string;
  kind: "products";
  stepNumber: number;
  title: string;
  iconUrl: string;
  reviewGroup: string;
  ctaLabel: string;
  products: ProductDefinition[];
}

export interface PlanOption {
  id: string;
  iconUrl: string;
  reviewIconUrl?: string;
  name: string;
  highlight: string;
  price: number;
  compareAtPrice?: number;
  description: string;
}

export interface PlanStepDefinition {
  id: string;
  kind: "plan";
  stepNumber: number;
  title: string;
  iconUrl: string;
  reviewGroup: string;
  ctaLabel: string;
  plans: PlanOption[];
}

export type BundleStepDefinition =
  | ProductStepDefinition
  | PlanStepDefinition;

export interface ShippingDefinition {
  id: string;
  name: string;
  iconUrl: string;
  price: number;
  compareAtPrice?: number;
  freeLabel?: string;
  contributesToSavings: boolean;
}

export interface BundleConfiguration {
  version: 1;
  openStepId: string;
  selectedPlanId: string;
  activeVariantByProduct: Record<string, string>;
  quantitiesBySku: Record<string, number>;
}

export interface BundleCatalog {
  version: 1;
  title: string;
  reviewTitle: string;
  reviewSubtitle: string;
  steps: BundleStepDefinition[];
  shipping: ShippingDefinition;
  guarantee: {
    imageUrl: string;
    title: string;
    description: string;
  };
  financing: {
    monthlyPrice: number;
  };
  initialConfiguration: BundleConfiguration;
}

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
