import type { FC } from "react";
import { twMerge } from "@/lib/twMerge";
import type {
  BundleLayout,
  ProductDefinition,
} from "@/types";
import ProductCard from "@/components/ProductCard";

interface ProductGridProps {
  products: ProductDefinition[];
  layout: BundleLayout;
}

const ProductGrid: FC<ProductGridProps> = ({
  products,
  layout,
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
              layout={layout}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
