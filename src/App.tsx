import type { FC } from "react";
import { bundleCatalog } from "@/Data/catalog";
import BundleBuilder from "@/components/BundleBuilder";

const App: FC = () => {
  return <BundleBuilder catalog={bundleCatalog} layout="sidebar" />;
};

export default App;
