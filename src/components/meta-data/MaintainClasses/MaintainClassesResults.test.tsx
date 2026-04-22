import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MaintainClassesResults from "./MaintainClassesResults";
import type { HeroClass } from "../../../dto/HeroClass";

// Mock the utils functions
vi.mock("../../../common/utils", () => ({
  getLastUpdatedString: vi.fn(date => `Mocked date for ${date}`),
  getDateAndTimeString: vi.fn(date => `Mocked time for ${date}`),
}));

describe("MaintainClassesResults", () => {
  const mockHeroClasses: HeroClass[] = [
    { id: 1, name: "Mage", created_at: "2024-03-01", updated_at: "2024-04-01" },
    { id: 2, name: "Warrior", created_at: "2024-03-02", updated_at: "2024-04-02" },
  ];

  const mockDeleteHeroClass = vi.fn();
  const mockSelectHeroClass = vi.fn();

  it("displays loading message when loading", () => {
    render(
      <MaintainClassesResults
        isLoading={true}
        heroClasses={[]}
        deleteHeroClass={mockDeleteHeroClass}
        onSelectHeroClass={mockSelectHeroClass}
      />
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays hero classes data when not loading", () => {
    render(
      <MaintainClassesResults
        isLoading={false}
        heroClasses={mockHeroClasses}
        deleteHeroClass={mockDeleteHeroClass}
        onSelectHeroClass={mockSelectHeroClass}
      />
    );

    // Check for table headers
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Last Updated")).toBeInTheDocument();

    // Check for hero class data
    expect(screen.getByText("Mage")).toBeInTheDocument();
    expect(screen.getByText("Warrior")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls deleteHeroClass when delete icon is clicked", () => {
    render(
      <MaintainClassesResults
        isLoading={false}
        heroClasses={mockHeroClasses}
        deleteHeroClass={mockDeleteHeroClass}
        onSelectHeroClass={mockSelectHeroClass}
      />
    );

    const deleteButtons = screen.getAllByTestId("delete-class");
    fireEvent.click(deleteButtons[0]);

    expect(mockDeleteHeroClass).toHaveBeenCalledWith(1);
  });

  it("calls onSelectHeroClass when a row is clicked", () => {
    render(
      <MaintainClassesResults
        isLoading={false}
        heroClasses={mockHeroClasses}
        deleteHeroClass={mockDeleteHeroClass}
        onSelectHeroClass={mockSelectHeroClass}
      />
    );

    fireEvent.click(screen.getByTestId("class-row-1"));
    expect(mockSelectHeroClass).toHaveBeenCalledWith(mockHeroClasses[0]);
  });

  it("formats dates using getLastUpdatedString", () => {
    render(
      <MaintainClassesResults
        isLoading={false}
        heroClasses={mockHeroClasses}
        deleteHeroClass={mockDeleteHeroClass}
        onSelectHeroClass={mockSelectHeroClass}
      />
    );

    expect(screen.getByText("Mocked date for 2024-04-01")).toBeInTheDocument();
    expect(screen.getByText("Mocked date for 2024-04-02")).toBeInTheDocument();
  });
});
