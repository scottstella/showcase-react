import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
// Wrap component with Router for NavLink
const renderWithRouter = component => {
  return render(React.createElement(BrowserRouter, null, component));
};
describe("Header", () => {
  it("renders without crashing", () => {
    renderWithRouter(React.createElement(Header, null));
    expect(screen.getByText("Deck Tracker")).toBeInTheDocument();
  });
  it("has the correct CSS class", () => {
    const { container } = renderWithRouter(React.createElement(Header, null));
    expect(container.firstChild).toHaveClass("header");
  });
  it("renders the Hearthstone banner image", () => {
    renderWithRouter(React.createElement(Header, null));
    const image = screen.getByAltText("hearthstone-banner");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("header-logo");
    expect(image.tagName.toLowerCase()).toBe("img");
  });
  it("contains a NavLink that links to home", () => {
    renderWithRouter(React.createElement(Header, null));
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });
  it("renders the title text", () => {
    renderWithRouter(React.createElement(Header, null));
    const title = screen.getByText("Deck Tracker");
    expect(title).toBeInTheDocument();
    expect(title.tagName.toLowerCase()).toBe("h1");
  });
  it("matches snapshot", () => {
    const { container } = renderWithRouter(React.createElement(Header, null));
    expect(container.firstChild).toMatchSnapshot();
  });
});
