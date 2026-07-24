import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBundleCatalog } from "@/api/catalog";
import BundleBuilder from "@/components/BundleBuilder";
import CatalogLoadState from "@/components/CatalogLoadState";

const App: FC = () => {
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

  if (!catalog) {
    return (
      <CatalogLoadState
        error={isError && !isFetching ? error.message : ""}
        onRetry={() => void refetch()}
      />
    );
  }

  return <BundleBuilder catalog={catalog} layout="sidebar" />;
};

export default App;
