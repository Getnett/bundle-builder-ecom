import App from "@/App";
import createAppQueryClient from "@/lib/queryClient";
import { WELCOME_SEEN_STORAGE_KEY } from "@/lib/welcome-state";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

const renderApp = () =>
  render(
    <QueryClientProvider client={createAppQueryClient()}>
      <App />
    </QueryClientProvider>,
  );

describe("App entry experience", () => {
  it("loads the catalog behind the first-visit welcome screen", async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.getByRole("status"))
      .toHaveTextContent("Loading your product options in the background");
    expect(localStorage.getItem(WELCOME_SEEN_STORAGE_KEY)).toBeNull();

    const enterButton = await screen.findByRole("button", {
      name: "Build my security system",
    });
    expect(enterButton).toBeEnabled();

    await user.click(enterButton);
    expect(localStorage.getItem(WELCOME_SEEN_STORAGE_KEY)).toBe("1");
    expect(
      await screen.findByRole("button", {
        name: "Choose your cameras, 2 selected",
      }),
    ).toBeInTheDocument();
  });

  it("skips the welcome screen on return visits", async () => {
    localStorage.setItem(WELCOME_SEEN_STORAGE_KEY, "1");
    renderApp();

    expect(
      screen.queryByRole("heading", {
        name: "Security shopping, made simple.",
      }),
    ).not.toBeInTheDocument();
    expect(
      await screen.findByRole("button", {
        name: "Choose your cameras, 2 selected",
      }),
    ).toBeInTheDocument();
  });
});
