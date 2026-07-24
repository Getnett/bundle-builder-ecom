import App from "@/App";
import createAppQueryClient from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("App catalog loading", () => {
  it("loads the catalog from the FastAPI endpoint", async () => {
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
  });
});
