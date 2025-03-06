import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MetaDataMenu from "./MetaDataMenu";

describe("MetaDataMenu", () => {
  const mockOnSelectMetaData = vi.fn();

  beforeEach(() => {
    mockOnSelectMetaData.mockClear();
  });

  it("renders without crashing", () => {
    render(<MetaDataMenu onSelectMetaData={mockOnSelectMetaData} />);
    expect(screen.getByText("Sets")).toBeInTheDocument();
    expect(screen.getByText("Hero Classes")).toBeInTheDocument();
    expect(screen.getByText("Tribes")).toBeInTheDocument();
  });

  it("renders all menu items without initial selection", () => {
    render(<MetaDataMenu onSelectMetaData={mockOnSelectMetaData} />);

    const sets = screen.getByText("Sets");
    const classes = screen.getByText("Hero Classes");
    const tribes = screen.getByText("Tribes");

    expect(sets).not.toHaveClass("meta-data-menu__selected");
    expect(classes).not.toHaveClass("meta-data-menu__selected");
    expect(tribes).not.toHaveClass("meta-data-menu__selected");
  });

  it("applies selected class when menu item is clicked", () => {
    render(<MetaDataMenu onSelectMetaData={mockOnSelectMetaData} />);

    const sets = screen.getByText("Sets");
    fireEvent.click(sets);

    expect(sets).toHaveClass("meta-data-menu__selected");
    expect(screen.getByText("Hero Classes")).not.toHaveClass(
      "meta-data-menu__selected",
    );
    expect(screen.getByText("Tribes")).not.toHaveClass(
      "meta-data-menu__selected",
    );
  });

  it("calls onSelectMetaData with correct id when menu item is clicked", () => {
    render(<MetaDataMenu onSelectMetaData={mockOnSelectMetaData} />);

    fireEvent.click(screen.getByText("Sets"));
    expect(mockOnSelectMetaData).toHaveBeenCalledWith("sets");

    fireEvent.click(screen.getByText("Hero Classes"));
    expect(mockOnSelectMetaData).toHaveBeenCalledWith("classes");

    fireEvent.click(screen.getByText("Tribes"));
    expect(mockOnSelectMetaData).toHaveBeenCalledWith("tribes");
  });

  it("updates selection when different menu item is clicked", () => {
    render(<MetaDataMenu onSelectMetaData={mockOnSelectMetaData} />);

    // Click Sets first
    fireEvent.click(screen.getByText("Sets"));
    expect(screen.getByText("Sets")).toHaveClass("meta-data-menu__selected");

    // Then click Hero Classes
    fireEvent.click(screen.getByText("Hero Classes"));
    expect(screen.getByText("Sets")).not.toHaveClass(
      "meta-data-menu__selected",
    );
    expect(screen.getByText("Hero Classes")).toHaveClass(
      "meta-data-menu__selected",
    );
  });

  it("renders with correct styling", () => {
    const { container } = render(
      <MetaDataMenu onSelectMetaData={mockOnSelectMetaData} />,
    );

    const menu = container.querySelector(".meta-data-menu");
    expect(menu).toBeInTheDocument();

    // Check that horizontal rule is present
    const hr = container.querySelector("hr");
    expect(hr).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <MetaDataMenu onSelectMetaData={mockOnSelectMetaData} />,
    );
    expect(container).toMatchSnapshot();
  });
});
