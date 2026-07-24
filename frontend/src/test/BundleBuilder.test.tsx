import BundleBuilder from "@/components/BundleBuilder";
import { fetchBundleCatalog } from "@/api/catalog";
import type { BundleCatalog, CartSummary } from "@/types";
import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

let bundleCatalog: BundleCatalog;

beforeAll(async () => {
  bundleCatalog = await fetchBundleCatalog();
});

const renderBuilder = (
  storageKey: string,
  onCheckout?: (summary: CartSummary) => void,
) =>
  render(
    <BundleBuilder
      catalog={bundleCatalog}
      storageKey={storageKey}
      onCheckout={onCheckout}
    />,
  );

describe("BundleBuilder interactions", () => {
  it("renders both public layout variants", () => {
    const { container, rerender } = renderBuilder(
      "bundle-builder:layouts",
    );
    expect(container.querySelector("[data-layout='sidebar']"))
      .toBeInTheDocument();

    rerender(
      <BundleBuilder
        catalog={bundleCatalog}
        storageKey="bundle-builder:layouts"
        layout="stacked"
      />,
    );
    expect(container.querySelector("[data-layout='stacked']"))
      .toBeInTheDocument();
  });

  it("creates fresh global state when the storage key changes", () => {
    const { rerender } = renderBuilder("bundle-builder:first");
    const card = screen.getByTestId("product-card-cam-floodlight");
    fireEvent.click(card);
    expect(card).toHaveAttribute("data-selected", "true");

    rerender(
      <BundleBuilder
        catalog={bundleCatalog}
        storageKey="bundle-builder:second"
      />,
    );
    expect(screen.getByTestId("product-card-cam-floodlight"))
      .toHaveAttribute("data-selected", "false");
  });

  it("opens step one, collapses it, and advances to the next step", async () => {
    const user = userEvent.setup();
    renderBuilder("bundle-builder:accordion");
    const cameras = screen.getByRole("button", {
      name: "Choose your cameras, 2 selected",
    });

    expect(cameras).toHaveAttribute("aria-expanded", "true");
    await user.click(cameras);
    expect(cameras).toHaveAttribute("aria-expanded", "false");

    await user.click(cameras);
    await user.click(
      screen.getByRole("button", { name: "Next: Choose your plan" }),
    );
    expect(
      screen.getByRole("button", {
        name: "Choose your plan, 1 selected",
      }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps active variant, card, and review quantities synchronized", async () => {
    const user = userEvent.setup();
    renderBuilder("bundle-builder:variants");
    const card = screen.getByTestId("product-card-cam-v4");

    fireEvent.click(within(card).getByRole("radio", { name: "Grey" }));
    const cardQuantity = within(card).getByRole("group", {
      name: "Wyze Cam v4 quantity",
    });
    expect(cardQuantity).toHaveTextContent("0");

    await user.click(
      within(card).getByRole("button", {
        name: "Increase Wyze Cam v4 quantity",
      }),
    );
    await user.click(
      within(card).getByRole("button", {
        name: "Increase Wyze Cam v4 quantity",
      }),
    );
    expect(screen.getByTestId("review-line-cam-v4-grey"))
      .toHaveTextContent("2");

    fireEvent.click(within(card).getByRole("radio", { name: "White" }));
    expect(cardQuantity).toHaveTextContent("1");

    const whiteReviewLine = screen.getByTestId(
      "review-line-cam-v4-white",
    );
    await user.click(
      within(whiteReviewLine).getByRole("button", {
        name: "Increase Wyze Cam v4 (White) quantity",
      }),
    );
    expect(cardQuantity).toHaveTextContent("2");
    expect(screen.getByTestId("review-line-cam-v4-grey"))
      .toHaveTextContent("2");
    expect(
      screen.getByRole("button", {
        name: "Choose your cameras, 2 selected",
      }),
    ).toBeInTheDocument();
  });

  it("selects an unselected product by clicking its card body", () => {
    renderBuilder("bundle-builder:card-selection");
    const card = screen.getByTestId("product-card-cam-floodlight");

    expect(card).toHaveAttribute("data-selected", "false");
    fireEvent.click(card);

    expect(card).toHaveAttribute("data-selected", "true");
    expect(screen.getByTestId("review-line-cam-floodlight-white"))
      .toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Choose your cameras, 3 selected",
      }),
    ).toBeInTheDocument();
  });

  it("enforces required minimums and confirms checkout and save actions", async () => {
    const user = userEvent.setup();
    const onCheckout = vi.fn();
    renderBuilder("bundle-builder:actions", onCheckout);

    const hubLine = screen.getByTestId("review-line-sense-hub");
    expect(
      within(hubLine).getByRole("button", {
        name: /Decrease Wyze Sense Hub.*quantity/,
      }),
    ).toBeDisabled();
    expect(
      within(hubLine).getByRole("button", {
        name: /Increase Wyze Sense Hub.*quantity/,
      }),
    ).toHaveClass("bg-surface");

    await user.click(screen.getByRole("button", { name: "Checkout" }));
    expect(onCheckout).toHaveBeenCalledWith({
      subtotal: 187.89,
      compareAtSubtotal: 238.81,
      savings: 50.92,
      monthlyPrice: 19.19,
    });
    expect(screen.getByTestId("status-message"))
      .toHaveTextContent("Checkout ready for $187.89.");

    await user.click(
      screen.getByRole("button", {
        name: "Save my system for later",
      }),
    );
    expect(screen.getByTestId("status-message"))
      .toHaveTextContent(/has been saved/i);
    expect(window.localStorage.getItem("bundle-builder:actions"))
      .not.toBeNull();
  });
});
