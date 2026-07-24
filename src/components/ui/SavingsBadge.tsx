import type { FC } from "react";
import { twMerge } from "@/lib/twMerge";

interface SavingsBadgeProps {
  label: string;
  className?: string;
}

const SavingsBadge: FC<SavingsBadgeProps> = ({
  label,
  className,
}) => {
  return (
    <span
      className={twMerge(
        "inline-flex min-h-4 items-center rounded-full bg-brand px-2 py-0.5 font-heading text-eyebrow font-semibold leading-none whitespace-nowrap text-on-brand",
        className,
      )}
    >
      {label}
    </span>
  );
};

export default SavingsBadge;
