import type { FC } from "react";
import { twMerge } from "@/lib/twMerge";
import type { BundleLayout } from "@/types";
import SavingsBadge from "@/components/ui/SavingsBadge";

interface ProductImageProps {
  imageUrl: string;
  name: string;
  badge?: string;
  layout: BundleLayout;
}

const ProductImage: FC<ProductImageProps> = ({
  imageUrl,
  name,
  badge,
  layout,
}) => {
  return (
    <div
      className={twMerge(
        "relative flex w-product-visual shrink-0 self-stretch items-center justify-center px-1",
        badge ? "pt-7 pb-2" : "py-3",
        layout === "stacked"
          ? "md:h-product-visual-stacked md:w-full md:px-3"
          : "md:h-product-visual-stacked md:w-full md:px-3 2xl:h-auto 2xl:w-product-visual 2xl:px-1",
        badge &&
          (layout === "stacked"
            ? "md:pt-7 md:pb-2"
            : "md:pt-7 md:pb-2 2xl:pt-7 2xl:pb-2"),
        !badge &&
          (layout === "stacked"
            ? "md:py-3"
            : "md:py-3 2xl:py-3"),
      )}
    >
      {badge && (
        <SavingsBadge label={badge} className="absolute top-0 left-0" />
      )}
      <img
        src={imageUrl}
        alt={name}
        className="size-product-image object-contain"
      />
    </div>
  );
};

export default ProductImage;
