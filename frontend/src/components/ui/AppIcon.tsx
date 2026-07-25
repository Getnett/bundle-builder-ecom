import {
  ArrowRight,
  BadgeDollarSign,
  ListChecks,
  Minus,
  Plus,
  Save,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps, FC } from "react";

const appIcons = {
  arrowRight: ArrowRight,
  badgeDollarSign: BadgeDollarSign,
  listChecks: ListChecks,
  minus: Minus,
  plus: Plus,
  save: Save,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export type AppIconName = keyof typeof appIcons;

type AppIconProps = {
  name: AppIconName;
} & ComponentProps<LucideIcon>;

const AppIcon: FC<AppIconProps> = ({ name, ...props }) => {
  const Icon = appIcons[name];

  return <Icon aria-hidden="true" {...props} />;
};

export default AppIcon;
