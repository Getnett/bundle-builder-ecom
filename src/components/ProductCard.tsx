import type { FC } from "react";
import { twMerge } from "@/lib/twMerge";
import {
  getActiveSku,
  getProductQuantity,
  isProductSelected,
} from "@/bundle-state";
import type {
  BundleConfiguration,
  BundleLayout,
  ProductDefinition,
  QuantityChangeHandler,
} from "@/types";
import ColorSwatches from "@/components/ColorSwatches";
import PriceTag from "@/components/PriceTag";
import ProductDescription from "@/components/ProductDescription";
import ProductImage from "@/components/ProductImage";
import QuantityStepper from "@/components/QuantityStepper";

interface ProductCardProps {
  product: ProductDefinition;
  configuration: BundleConfiguration;
  layout: BundleLayout;
  onActiveVariantChange: (productId: string, variantId: string) => void;
  onQuantityChange: QuantityChangeHandler;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  configuration,
  layout,
  onActiveVariantChange,
  onQuantityChange,
}) => {
  const selected = isProductSelected(product, configuration);
  const activeSku = getActiveSku(product, configuration);
  const quantity = getProductQuantity(product, configuration);
  const displayMultiplier = Math.max(1, quantity);
  const activeVariantId =
    configuration.activeVariantByProduct[product.id] ??
    product.variants?.[0]?.id;
  const minQuantity = product.minQuantity ?? 0;
  const maxQuantity = product.maxQuantity ?? 99;

  return (
    <article
      className={twMerge(
        "relative flex h-full min-h-product-card min-w-0 flex-row gap-3 rounded-card border-2 bg-surface p-3 transition-colors",
        layout === "stacked"
          ? "md:flex-col md:items-stretch"
          : "md:flex-col md:items-stretch 2xl:flex-row",
        selected
          ? "border-2 border-selected"
          : "border-transparent hover:border-border",
      )}
      data-selected={selected}
      data-testid={`product-card-${product.id}`}
    >
      <ProductImage
        imageUrl={product.imageUrl}
        name={product.name}
        badge={product.badge}
        layout={layout}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="font-heading text-body font-semibold text-foreground">
            {product.name}
          </h3>
          <ProductDescription product={product} layout={layout} />

          {product.variants?.length && activeVariantId ? (
            <ColorSwatches
              variants={product.variants}
              value={activeVariantId}
              onChange={(variantId) =>
                onActiveVariantChange(product.id, variantId)
              }
              productName={product.name}
            />
          ) : null}
        </div>

        <div className="flex shrink-0 items-end justify-between gap-4">
          <QuantityStepper
            value={quantity}
            onChange={(next) =>
              onQuantityChange(activeSku, next, minQuantity, maxQuantity)
            }
            min={minQuantity}
            max={maxQuantity}
            label={product.name}
            size="sm"
          />
          <PriceTag
            price={product.unitPrice * displayMultiplier}
            compareAtPrice={
              product.compareAtUnitPrice == null
                ? undefined
                : product.compareAtUnitPrice * displayMultiplier
            }
            freeLabel={product.freeLabel}
            stacked
            size="sm"
            tone={
              product.compareAtUnitPrice == null ? "neutral" : "promotion"
            }
          />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
