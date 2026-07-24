import type { FC } from "react";
import { Sparkles } from "lucide-react";

const ShoppingBagMark: FC = () => (
  <div
    aria-hidden="true"
    className="relative mx-auto h-28 w-28 motion-safe:animate-welcome-float"
  >
    <div className="absolute inset-0 rounded-full bg-brand-soft" />
    <div className="absolute top-2 left-1/2 h-9 w-12 -translate-x-1/2 rounded-t-full border-4 border-success border-b-0" />
    <div className="absolute inset-x-5 bottom-3 flex h-20 -rotate-3 items-center justify-center rounded-card bg-success shadow-lg">
      <span className="font-heading text-5xl font-bold text-on-brand">S</span>
    </div>
    <Sparkles className="absolute -top-1 right-1 h-7 w-7 text-brand" />
    <span className="absolute right-0 bottom-5 h-3 w-3 rounded-full bg-promotion" />
  </div>
);

export default ShoppingBagMark;
