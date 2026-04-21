import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock child components
vi.mock("./components/Nav/Nav", () => ({
  default: () => React.createElement("div", { "data-testid": "nav" }, "Nav Component"),
}));

vi.mock("./components/Welcome/Welcome", () => ({
  default: () => React.createElement("div", { "data-testid": "welcome" }, "Welcome Component"),
}));

vi.mock("./components/Aside/Aside", () => ({
  default: () => React.createElement("div", { "data-testid": "aside" }, "Aside Component"),
}));

vi.mock("./components/Footer/Footer", () => ({
  default: () => React.createElement("div", { "data-testid": "footer" }, "Footer Component"),
}));

vi.mock("./components/Header/Header", () => ({
  default: () => React.createElement("div", { "data-testid": "header" }, "Header Component"),
}));

vi.mock("./components/meta-data/MetaData", () => ({
  default: () => React.createElement("div", { "data-testid": "meta-data" }, "MetaData Component"),
}));

vi.mock("./components/meta-data/MaintainCards/MaintainCards", () => ({
  default: () =>
    React.createElement("div", { "data-testid": "manage-cards" }, "Manage Cards Component"),
}));

vi.mock("react-toastify", () => ({
  ToastContainer: () =>
    React.createElement("div", { "data-testid": "toast-container" }, "Toast Container"),
}));

describe("App", () => {
  it("renders all layout components", async () => {
    render(<App />);

    // Ensure lazy route content resolves before assertions complete.
    expect(await screen.findByTestId("welcome")).toBeInTheDocument();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();
    expect(screen.getByTestId("aside")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });

  it("renders Welcome component on root path", async () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(await screen.findByTestId("welcome")).toBeInTheDocument();
  });

  it("renders MetaData component on /manageMetaData path", async () => {
    window.history.pushState({}, "", "/manageMetaData");
    render(<App />);

    expect(await screen.findByTestId("meta-data")).toBeInTheDocument();
  });

  it("renders Manage Cards component on /manageCards path", async () => {
    window.history.pushState({}, "", "/manageCards");
    render(<App />);

    expect(await screen.findByTestId("manage-cards")).toBeInTheDocument();
  });

  it("has correct layout structure", () => {
    render(<App />);

    const gridContainer = document.querySelector(".grid-container");
    expect(gridContainer).toBeInTheDocument();

    expect(document.querySelector(".header-section")).toBeInTheDocument();
    expect(document.querySelector(".nav-section")).toBeInTheDocument();
    expect(document.querySelector(".main-section")).toBeInTheDocument();
    expect(document.querySelector(".aside-section")).toBeInTheDocument();
    expect(document.querySelector(".footer-section")).toBeInTheDocument();
  });

  it("renders ToastContainer outside grid layout", () => {
    render(<App />);

    const gridContainer = document.querySelector(".grid-container");
    const toastContainer = screen.getByTestId("toast-container");

    expect(toastContainer).toBeInTheDocument();
    expect(gridContainer?.contains(toastContainer)).toBe(false);
  });
});
