import type { FC } from "react";
import { twMerge } from "@/lib/twMerge";

interface SolidChevronProps {
  open: boolean;
}

const SolidChevron: FC<SolidChevronProps> = ({ open }) => {
  return (
    <svg
      viewBox="0 0 14 9"
      aria-hidden="true"
      className={twMerge(
        "size-3.5 shrink-0 text-brand transition-transform duration-200 ease-out motion-reduce:transition-none",
        !open && "rotate-180",
      )}
    >
      <path
        fill="currentColor"
        d="M6.17.96a1 1 0 0 1 1.66 0l5.04 6.3A1 1 0 0 1 12.04 9H1.96a1 1 0 0 1-.83-1.74L6.17.96Z"
      />
    </svg>
  );
};

export default SolidChevron;
