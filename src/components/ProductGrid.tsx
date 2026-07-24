import type { FC } from "react";
import { twMerge } from "@/lib/twMerge";
import type {
  BundleConfiguration,
  BundleLayout,
  ProductDefinition,
  QuantityChangeHandler,
} from "@/types";
import ProductCard from "@/components/ProductCard";

interface ProductGridProps {
  products: ProductDefinition[];
  configuration: BundleConfiguration;
  layout: BundleLayout;
  onActiveVariantChange: (productId: string, variantId: string) => void;
  onQuantityChange: QuantityChangeHandler;
}

const ProductGrid: FC<ProductGridProps> = ({
  products,
  configuration,
  layout,
  onActiveVariantChange,
  onQuantityChange,
}) => {
  return (
    <div
      className={twMerge(
        "grid w-full grid-cols-1 gap-4",
        layout === "stacked"
          ? "sm:grid-cols-2 xl:grid-cols-5"
          : "sm:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-2",
      )}
    >
      {products.map((product, productIndex) => {
        const centerOddCard =
          layout === "sidebar" &&
          products.length % 2 === 1 &&
          productIndex === products.length - 1;

        return (
          <div
            key={product.id}
            className={twMerge(
              "h-full min-w-0",
              centerOddCard &&
                "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)] xl:col-span-1 xl:mx-0 xl:w-auto 2xl:col-span-2 2xl:mx-auto 2xl:w-[calc(50%-0.5rem)]",
            )}
          >
            <ProductCard
              product={product}
              configuration={configuration}
              layout={layout}
              onActiveVariantChange={onActiveVariantChange}
              onQuantityChange={onQuantityChange}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
