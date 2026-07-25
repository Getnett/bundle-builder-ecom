import { useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBundleCatalog } from "@/api/catalog";
import BundleBuilder from "@/components/BundleBuilder";
import CatalogLoadState from "@/components/CatalogLoadState";
import WelcomePage from "@/components/WelcomePage";
import {
  hasSeenWelcome,
  markWelcomeSeen,
} from "@/lib/welcome-state";

const App: FC = () => {
  const [showWelcome, setShowWelcome] = useState(
    () => !hasSeenWelcome(),
  );
  const {
    data: catalog,
    error,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["bundle-catalog"],
    queryFn: ({ signal }) => fetchBundleCatalog(signal),
  });

  const enterBuilder = () => {
    markWelcomeSeen();
    setShowWelcome(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  };

  if (showWelcome) {
    return (
      <WelcomePage
        catalogReady={Boolean(catalog)}
        error={isError && !isFetching ? error.message : ""}
        onEnter={enterBuilder}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!catalog) {
    return (
      <CatalogLoadState
        error={isError && !isFetching ? error.message : ""}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="motion-safe:animate-welcome-reveal">
      <BundleBuilder catalog={catalog} layout="sidebar" />
    </div>
  );
};

export default App;
