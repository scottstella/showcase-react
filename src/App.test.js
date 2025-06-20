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
vi.mock("react-toastify", () => ({
  ToastContainer: () =>
    React.createElement("div", { "data-testid": "toast-container" }, "Toast Container"),
}));
describe("App", () => {
  it("renders all layout components", () => {
    render(React.createElement(App, null));
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();
    expect(screen.getByTestId("aside")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });
  it("renders Welcome component on root path", () => {
    window.history.pushState({}, "", "/");
    render(React.createElement(App, null));
    expect(screen.getByTestId("welcome")).toBeInTheDocument();
  });
  it("renders MetaData component on /manageMetaData path", () => {
    window.history.pushState({}, "", "/manageMetaData");
    render(React.createElement(App, null));
    expect(screen.getByTestId("meta-data")).toBeInTheDocument();
  });
  it("has correct layout structure", () => {
    render(React.createElement(App, null));
    const gridContainer = document.querySelector(".grid-container");
    expect(gridContainer).toBeInTheDocument();
    expect(document.querySelector(".header-section")).toBeInTheDocument();
    expect(document.querySelector(".nav-section")).toBeInTheDocument();
    expect(document.querySelector(".main-section")).toBeInTheDocument();
    expect(document.querySelector(".aside-section")).toBeInTheDocument();
    expect(document.querySelector(".footer-section")).toBeInTheDocument();
  });
  it("renders ToastContainer outside grid layout", () => {
    render(React.createElement(App, null));
    const gridContainer = document.querySelector(".grid-container");
    const toastContainer = screen.getByTestId("toast-container");
    expect(toastContainer).toBeInTheDocument();
    expect(gridContainer?.contains(toastContainer)).toBe(false);
  });
});
