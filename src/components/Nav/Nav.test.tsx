import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Nav from "./Nav";

// Wrap component with Router for NavLink to work
const renderWithRouter = () => {
  return render(
    <BrowserRouter>
      <Nav />
    </BrowserRouter>
  );
};

describe("Nav", () => {
  it("renders without crashing", () => {
    renderWithRouter();
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("renders all navigation sections", () => {
    renderWithRouter();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Decks")).toBeInTheDocument();
  });

  describe("Admin section", () => {
    it("starts collapsed", () => {
      renderWithRouter();
      const adminLinks = screen.getByText("Manage Meta-Data").parentElement;
      expect(adminLinks).toHaveClass("nav-group-collapsed");
      expect(screen.getByText("Admin").previousElementSibling).toHaveClass(
        "fa-angle-right"
      );
    });

    it("expands when clicked", () => {
      renderWithRouter();
      fireEvent.click(screen.getByText("Admin"));
      const adminLinks = screen.getByText("Manage Meta-Data").parentElement;
      expect(adminLinks).toHaveClass("nav-group-expanded");
      expect(screen.getByText("Admin").previousElementSibling).toHaveClass(
        "fa-angle-down"
      );
    });

    it("shows correct links when expanded", () => {
      renderWithRouter();
      fireEvent.click(screen.getByText("Admin"));

      const links = screen.getAllByText(/Manage/);
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent("Manage Meta-Data");
      expect(links[1]).toHaveTextContent("Manage Cards");
    });
  });

  describe("Decks section", () => {
    it("starts collapsed", () => {
      renderWithRouter();
      const decksLinks = screen.getByText("Link 1").parentElement;
      expect(decksLinks).toHaveClass("nav-group-collapsed");
      expect(screen.getByText("Decks").previousElementSibling).toHaveClass(
        "fa-angle-right"
      );
    });

    it("expands when clicked", () => {
      renderWithRouter();
      fireEvent.click(screen.getByText("Decks"));
      const decksLinks = screen.getByText("Link 1").parentElement;
      expect(decksLinks).toHaveClass("nav-group-expanded");
      expect(screen.getByText("Decks").previousElementSibling).toHaveClass(
        "fa-angle-down"
      );
    });

    it("shows correct links when expanded", () => {
      renderWithRouter();
      fireEvent.click(screen.getByText("Decks"));

      const links = screen.getAllByText(/Link/);
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent("Link 1");
      expect(links[1]).toHaveTextContent("Link 2");
    });
  });

  it("allows sections to be independently expanded", () => {
    renderWithRouter();

    // Expand both sections
    fireEvent.click(screen.getByText("Admin"));
    fireEvent.click(screen.getByText("Decks"));

    // Check both are expanded
    expect(screen.getByText("Manage Meta-Data").parentElement).toHaveClass(
      "nav-group-expanded"
    );
    expect(screen.getByText("Link 1").parentElement).toHaveClass(
      "nav-group-expanded"
    );

    // Collapse Admin only
    fireEvent.click(screen.getByText("Admin"));

    // Check Admin is collapsed but Decks is still expanded
    expect(screen.getByText("Manage Meta-Data").parentElement).toHaveClass(
      "nav-group-collapsed"
    );
    expect(screen.getByText("Link 1").parentElement).toHaveClass(
      "nav-group-expanded"
    );
  });

  it("matches snapshot", () => {
    const { container } = renderWithRouter();
    expect(container).toMatchSnapshot();
  });
});
