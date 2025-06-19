/// <reference types="vitest/globals" />
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Aside from "./Aside";

describe("Aside", () => {
  it("matches snapshot", () => {
    const { container } = render(<Aside />);
    expect(container).toMatchSnapshot();
  });

  it("renders without crashing", () => {
    render(<Aside />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("has the correct CSS class", () => {
    const { container } = render(<Aside />);
    const asideElement = container.querySelector("aside");
    expect(asideElement).toHaveClass("aside");
  });

  it("displays all expected content", () => {
    render(<Aside />);
    // Development date
    expect(screen.getByText("2022-2025")).toBeInTheDocument();

    // Technologies used
    expect(
      screen.getByText(/React, Javascript, CSS, Supabase, Toastify, Font Awesome, Formik, Bruno/i)
    ).toBeInTheDocument();

    // Developer name
    expect(screen.getByText("Scott Stella")).toBeInTheDocument();
  });

  it("displays all section headings", () => {
    render(<Aside />);
    expect(screen.getByText("Developed:")).toBeInTheDocument();
    expect(screen.getByText("Showcasing")).toBeInTheDocument();
    expect(screen.getByText("Developed by:")).toBeInTheDocument();
  });

  it("has the correct structure", () => {
    render(<Aside />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });
});
