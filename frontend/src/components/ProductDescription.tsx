import type { FC } from "react";
import type { BundleLayout, ProductDefinition } from "@/types";

interface ProductDescriptionProps {
  product: ProductDefinition;
  layout: BundleLayout;
}

const learnMoreClasses =
  "whitespace-nowrap text-link underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

const LearnMore: FC<{ product: ProductDefinition }> = ({ product }) =>
  product.learnMoreUrl ? (
    <a
      href={product.learnMoreUrl}
      target="_blank"
      rel="noreferrer"
      className={learnMoreClasses}
    >
      Learn More
    </a>
  ) : null;

const ProductDescription: FC<ProductDescriptionProps> = ({
  product,
  layout,
}) => {
  const designLines = product.desktopDescriptionLines;

  if (layout === "stacked" || !designLines) {
    return (
      <p className="font-body text-caption text-foreground-muted">
        {product.description} <LearnMore product={product} />
      </p>
    );
  }

  return (
    <>
      <p className="font-body text-caption text-foreground-muted 2xl:hidden">
        {product.description} <LearnMore product={product} />
      </p>
      <p className="hidden font-body text-caption text-foreground-muted 2xl:block">
        {designLines.map((line, index) => (
          <span key={`${product.id}-${index}`} className="block">
            {line}
            {index === designLines.length - 1 && (
              <>
                {line && " "}
                <LearnMore product={product} />
              </>
            )}
          </span>
        ))}
      </p>
    </>
  );
};

export default ProductDescription;
