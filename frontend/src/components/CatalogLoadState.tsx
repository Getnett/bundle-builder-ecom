import type { FC } from "react";
import Button from "@/components/ui/Button";

interface CatalogLoadStateProps {
  error: string;
  onRetry: () => void;
}

const CatalogLoadState: FC<CatalogLoadStateProps> = ({
  error,
  onRetry,
}) => {
  if (!error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p
          className="font-body text-body text-foreground-muted"
          role="status"
        >
          Loading your security options…
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="flex max-w-md flex-col items-center gap-4 rounded-panel bg-review-surface p-6 text-center">
        <h1 className="font-heading text-section font-semibold text-foreground">
          We couldn’t load the catalog
        </h1>
        <p className="font-body text-body text-foreground-muted">
          {error}
        </p>
        <Button onClick={onRetry}>Try again</Button>
      </section>
    </main>
  );
};

export default CatalogLoadState;
