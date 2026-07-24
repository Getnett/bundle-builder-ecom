import App from "@/App";
import createAppQueryClient from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("App catalog loading", () => {
  it("loads the catalog behind the welcome screen before entering", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={createAppQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(screen.getByRole("status"))
      .toHaveTextContent("Loading your product options in the background");

    const enterButton = await screen.findByRole("button", {
      name: "Build my security system",
    });
    expect(enterButton).toBeEnabled();

    await user.click(enterButton);
    expect(
      await screen.findByRole("button", {
        name: "Choose your cameras, 2 selected",
      }),
    ).toBeInTheDocument();
  });
});
