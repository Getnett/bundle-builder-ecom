import App from "@/App";
import createAppQueryClient from "@/lib/queryClient";
import { bundleCatalog } from "@/test/fixtures";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("App catalog loading", () => {
  it("loads the catalog from the FastAPI endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => bundleCatalog,
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <QueryClientProvider client={createAppQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(screen.getByRole("status"))
      .toHaveTextContent("Loading your security options");
    expect(
      await screen.findByRole("button", {
        name: "Choose your cameras, 2 selected",
      }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/catalog",
      expect.objectContaining({
        headers: { Accept: "application/json" },
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
