import { extendTailwindMerge } from "tailwind-merge";

export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "eyebrow",
            "caption",
            "body",
            "product-title",
            "control",
            "step",
            "section",
            "total",
            "hero",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "foreground",
            "foreground-strong",
            "foreground-muted",
            "foreground-subtle",
            "foreground-faint",
            "brand",
            "on-brand",
            "selected",
            "success",
            "promotion",
            "link",
          ],
        },
      ],
    },
  },
});
