import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Welcome from "./Welcome";

describe("Welcome", () => {
  it("renders without crashing", () => {
    render(<Welcome />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("displays the Hearthstone icon with correct attributes", () => {
    render(<Welcome />);
    const logo = screen.getByAltText("Hearthstone Icon");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute(
      "src",
      "/src/assets/images/hearthstone-icon.png"
    );
    expect(logo).toHaveClass("welcome-logo");
  });

  it("has correct structure and styling", () => {
    render(<Welcome />);

    // Check main container
    const container = screen.getByTestId("welcome-container");
    expect(container).toHaveClass("welcome");

    // Check header section
    const headerSection = screen.getByTestId("welcome-header");
    expect(headerSection).toHaveClass("welcome-header-section");

    // Check heading
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Welcome");

    // Check paragraphs (using container query since paragraphs don't have a role)
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(3);
    paragraphs.forEach((p) => {
      expect(p).toBeInTheDocument();
      expect(p).toHaveTextContent(/Lorem ipsum/);
    });
  });

  it("matches snapshot", () => {
    const { container } = render(<Welcome />);
    expect(container).toMatchSnapshot();
  });
});
