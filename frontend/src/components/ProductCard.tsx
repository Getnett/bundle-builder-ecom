import type { FC } from "react";
import { twMerge } from "@/lib/twMerge";
import {
  getActiveSku,
  isProductSelected,
} from "@/bundle-state";
import type {
  BundleLayout,
  ProductDefinition,
} from "@/types";
import { useBundleStore } from "@/store/useBundleStore";
import ColorSwatches from "@/components/ColorSwatches";
import PriceTag from "@/components/PriceTag";
import ProductDescription from "@/components/ProductDescription";
import ProductImage from "@/components/ProductImage";
import QuantityStepper from "@/components/QuantityStepper";

interface ProductCardProps {
  product: ProductDefinition;
  layout: BundleLayout;
}

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  Boolean(target.closest("a, button, [role='radio']"));

const ProductCard: FC<ProductCardProps> = ({
  product,
  layout,
}) => {
  const activeVariantId = useBundleStore(
    (state) =>
      state.configuration.activeVariantByProduct[product.id] ??
      product.variants?.[0]?.id,
  );
  const activeSku = useBundleStore((state) =>
    getActiveSku(product, state.configuration),
  );
  const quantity = useBundleStore(
    (state) => state.configuration.quantitiesBySku[activeSku] ?? 0,
  );
  const selected = useBundleStore((state) =>
    isProductSelected(product, state.configuration),
  );
  const setActiveVariant = useBundleStore(
    (state) => state.actions.setActiveVariant,
  );
  const setQuantity = useBundleStore(
    (state) => state.actions.setQuantity,
  );
  const displayMultiplier = Math.max(1, quantity);
  const minQuantity = product.minQuantity ?? 0;
  const maxQuantity = product.maxQuantity ?? 99;
  const selectProduct = () => {
    if (quantity === 0) {
      setQuantity(activeSku, Math.min(maxQuantity, Math.max(1, minQuantity)));
    }
  };

  return (
    <article
      className={twMerge(
        "relative flex h-full min-h-product-card min-w-0 flex-row gap-3 rounded-card border-2 bg-surface p-3 transition-colors",
        layout === "stacked"
          ? "md:flex-col md:items-stretch"
          : "md:flex-col md:items-stretch xl:flex-row",
        selected
          ? "border-2 border-selected"
          : "border-transparent hover:border-border",
        quantity === 0 && "cursor-pointer",
      )}
      onClick={(event) => {
        if (!isInteractiveTarget(event.target)) selectProduct();
      }}
      data-selected={selected}
      data-testid={`product-card-${product.id}`}
    >
      <ProductImage
        imageUrl={product.imageUrl}
        name={product.name}
        badge={product.badge}
        layout={layout}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-body font-semibold text-foreground">
            {product.name}
          </h3>
          <ProductDescription product={product} layout={layout} />

          {product.variants?.length && activeVariantId ? (
            <ColorSwatches
              variants={product.variants}
              value={activeVariantId}
              onChange={(variantId) =>
                setActiveVariant(product.id, variantId)
              }
              productName={product.name}
            />
          ) : null}
        </div>

        <div
          className={twMerge(
            "flex shrink-0 items-end justify-between gap-4",
            layout === "stacked" ? "mt-auto" : "md:mt-auto xl:mt-0",
          )}
        >
          <QuantityStepper
            value={quantity}
            onChange={(next) => setQuantity(activeSku, next)}
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
