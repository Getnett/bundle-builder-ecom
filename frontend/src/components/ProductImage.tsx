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
        "relative flex w-product-visual shrink-0 self-stretch items-center px-1",
        badge ? "flex-col justify-start gap-1 pb-2" : "justify-center py-3",
        layout === "stacked"
          ? "md:h-product-visual-stacked md:w-full md:px-3"
          : "md:h-product-visual-stacked md:w-full md:px-3 xl:h-auto xl:w-product-visual xl:px-1",
      )}
    >
      {badge && (
        <SavingsBadge label={badge} className="self-start" />
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
