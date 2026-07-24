import { bundleCatalog } from "@/Data/catalog";
import {
  calculateSummary,
  countSelectedProducts,
  getActiveSku,
  selectReviewGroups,
} from "@/bundle-state";
import { createBundleStore } from "@/store/bundle-store";
import type { ProductStepDefinition } from "@/types";
import { describe, expect, it, vi } from "vitest";

const storageKey = "bundle-builder:test";
const createStore = (key = storageKey) =>
  createBundleStore({ catalog: bundleCatalog, storageKey: key });

const cameraStep = bundleCatalog.steps.find(
  (step): step is ProductStepDefinition =>
    step.kind === "products" && step.id === "cameras",
);

describe("bundle store configuration", () => {
  it("tracks variant quantities independently and creates separate lines", () => {
    const store = createStore();

    store.getState().actions.setActiveVariant("cam-v4", "grey");
    expect(
      getActiveSku(
        cameraStep!.products[0],
        store.getState().configuration,
      ),
    ).toBe("cam-v4-grey");

    store.getState().actions.setQuantity("cam-v4-grey", 2);
    store.getState().actions.setActiveVariant("cam-v4", "white");

    const configuration = store.getState().configuration;
    expect(configuration.quantitiesBySku["cam-v4-white"]).toBe(1);
    expect(configuration.quantitiesBySku["cam-v4-grey"]).toBe(2);

    const cameraLines = selectReviewGroups(
      bundleCatalog,
      configuration,
    ).find((group) => group.id === "cameras")?.lines;
    expect(cameraLines?.map((line) => line.sku)).toEqual(
      expect.arrayContaining(["cam-v4-white", "cam-v4-grey"]),
    );
    expect(
      cameraLines?.find((line) => line.sku === "cam-v4-white")?.name,
    ).toBe("Wyze Cam v4 (White)");
    expect(
      cameraLines?.find((line) => line.sku === "cam-v4-grey")?.name,
    ).toBe("Wyze Cam v4 (Grey)");
  });

  it("counts a product once when multiple variants are selected", () => {
    const store = createStore();
    store.getState().actions.setQuantity("cam-v4-grey", 3);

    expect(
      countSelectedProducts(
        cameraStep!.products,
        store.getState().configuration,
      ),
    ).toBe(2);
  });

  it("supports non-variant products and enforces SKU limits", () => {
    const store = createStore();

    store.getState().actions.setQuantity("cam-doorbell", 3);
    store.getState().actions.setQuantity("sense-hub", 0);
    expect(store.getState().configuration.quantitiesBySku["sense-hub"])
      .toBe(1);

    store.getState().actions.setQuantity("sense-hub", 100);
    expect(store.getState().configuration.quantitiesBySku["sense-hub"])
      .toBe(10);

    const beforeInvalidSku = store.getState().configuration;
    store.getState().actions.setQuantity("unknown-sku", 5);
    expect(store.getState().configuration).toBe(beforeInvalidSku);

    const doorbellLine = selectReviewGroups(
      bundleCatalog,
      store.getState().configuration,
    )
      .flatMap((group) => group.lines)
      .find((line) => line.sku === "cam-doorbell");
    expect(doorbellLine?.quantity).toBe(3);
  });

  it("rejects invalid step, plan, and variant mutations", () => {
    const store = createStore();
    const initial = store.getState().configuration;

    store.getState().actions.setOpenStep("not-a-step");
    store.getState().actions.setPlan("not-a-plan");
    store.getState().actions.setActiveVariant("cam-v4", "purple");

    expect(store.getState().configuration).toBe(initial);
  });

  it("calculates exact cent-based totals and live changes", () => {
    const store = createStore();
    expect(
      calculateSummary(bundleCatalog, store.getState().configuration),
    ).toEqual({
      subtotal: 187.89,
      compareAtSubtotal: 238.81,
      savings: 50.92,
      monthlyPrice: 19.19,
    });

    store.getState().actions.setQuantity("cam-v4-white", 2);
    expect(
      calculateSummary(bundleCatalog, store.getState().configuration),
    ).toEqual({
      subtotal: 215.87,
      compareAtSubtotal: 274.79,
      savings: 58.92,
      monthlyPrice: 19.19,
    });
  });
});

describe("explicit configuration persistence", () => {
  it("does not write until save and restores the exact saved configuration", () => {
    const store = createStore();
    store.getState().actions.setOpenStep("");
    store.getState().actions.setActiveVariant("cam-v4", "grey");
    store.getState().actions.setQuantity("cam-v4-grey", 4);

    expect(window.localStorage.getItem(storageKey)).toBeNull();
    store.getState().actions.saveConfiguration();

    const savedConfiguration = store.getState().configuration;
    expect(JSON.parse(window.localStorage.getItem(storageKey)!))
      .toEqual(savedConfiguration);
    expect(store.getState().statusMessage).toMatch(/has been saved/i);

    const restored = createStore();
    expect(restored.getState().configuration).toEqual(savedConfiguration);
    expect(restored.getState().configuration.openStepId).toBe("");
  });

  it("falls back for invalid JSON and stale configuration versions", () => {
    window.localStorage.setItem(storageKey, "{invalid");
    expect(createStore().getState().configuration)
      .toEqual(bundleCatalog.initialConfiguration);

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...bundleCatalog.initialConfiguration,
        version: 2,
      }),
    );
    expect(createStore().getState().configuration)
      .toEqual(bundleCatalog.initialConfiguration);
  });

  it("normalizes missing SKUs and invalid saved identifiers", () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        openStepId: "unknown-step",
        selectedPlanId: "unknown-plan",
        activeVariantByProduct: { "cam-v4": "purple" },
        quantitiesBySku: { "cam-v4-white": 6 },
      }),
    );

    const configuration = createStore().getState().configuration;
    expect(configuration.openStepId).toBe("cameras");
    expect(configuration.selectedPlanId).toBe("cam-unlimited");
    expect(configuration.activeVariantByProduct["cam-v4"]).toBe("white");
    expect(configuration.quantitiesBySku["cam-v4-white"]).toBe(6);
    expect(configuration.quantitiesBySku["cam-pan-v3-white"]).toBe(2);
  });

  it("falls back when reads fail and reports failed writes", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
      throw new Error("blocked");
    });
    const store = createStore();
    expect(store.getState().configuration)
      .toEqual(bundleCatalog.initialConfiguration);

    vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("blocked");
    });
    store.getState().actions.saveConfiguration();
    expect(store.getState().statusMessage).toMatch(/couldn’t save/i);
  });

  it("clears transient status after a configuration change", () => {
    const store = createStore();
    store.getState().actions.setStatusMessage("Complete");
    store.getState().actions.setQuantity("cam-v4-white", 2);
    expect(store.getState().statusMessage).toBe("");
  });
});
