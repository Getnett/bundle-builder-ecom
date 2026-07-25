import type { FC } from "react";
import { twMerge } from "@/lib/twMerge";
import type { BundleLayout, ProductDefinition } from "@/types";
import ProductCard from "@/components/ProductCard";

interface ProductGridProps {
  products: ProductDefinition[];
  layout: BundleLayout;
}

const ProductGrid: FC<ProductGridProps> = ({ products, layout }) => {
  return (
    <div
      className={twMerge(
        "grid w-full grid-cols-1 gap-product-card-gap",
        layout === "stacked"
          ? "sm:grid-cols-2 xl:grid-cols-5"
          : "sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-2",
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
                "sm:col-span-2 sm:mx-auto sm:w-[calc((100%_-_var(--spacing-product-card-gap))/2)] lg:col-span-1 lg:mx-0 lg:w-auto xl:col-span-2 xl:mx-auto xl:w-[calc((100%_-_var(--spacing-product-card-gap))/2)]",
            )}
          >
            <ProductCard product={product} layout={layout} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
