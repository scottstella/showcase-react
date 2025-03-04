import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders without crashing", () => {
    render(<Footer />);
    expect(screen.getByText(/Copyright 2025 stella.ws/i)).toBeInTheDocument();
  });

  it("has the correct CSS class", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toHaveClass("footer");
  });

  it("matches snapshot", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
