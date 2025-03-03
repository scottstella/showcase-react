import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";

// Wrap component with Router for NavLink
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Header", () => {
  it("renders without crashing", () => {
    renderWithRouter(<Header />);
    expect(screen.getByText("Deck Tracker")).toBeInTheDocument();
  });

  it("has the correct CSS class", () => {
    const { container } = renderWithRouter(<Header />);
    expect(container.firstChild).toHaveClass("header");
  });

  it("renders the Hearthstone banner image", () => {
    renderWithRouter(<Header />);
    const image = screen.getByAltText("hearthstone-banner");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("header-logo");
    expect(image.tagName.toLowerCase()).toBe("img");
  });

  it("contains a NavLink that links to home", () => {
    renderWithRouter(<Header />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the title text", () => {
    renderWithRouter(<Header />);
    const title = screen.getByText("Deck Tracker");
    expect(title).toBeInTheDocument();
    expect(title.tagName.toLowerCase()).toBe("h1");
  });

  it("matches snapshot", () => {
    const { container } = renderWithRouter(<Header />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
