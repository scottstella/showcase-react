import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MaintainClassesResults from "./MaintainClassesResults";
// Mock the utils functions
vi.mock("../../../common/utils", () => ({
  getLastUpdatedString: vi.fn(date => `Mocked date for ${date}`),
  getDateAndTimeString: vi.fn(date => `Mocked time for ${date}`),
}));
describe("MaintainClassesResults", () => {
  const mockHeroClasses = [
    { id: 1, name: "Mage", created_at: "2024-03-01" },
    { id: 2, name: "Warrior", created_at: "2024-03-02" },
  ];
  const mockDeleteHeroClass = vi.fn();
  it("displays loading message when loading", () => {
    render(
      React.createElement(MaintainClassesResults, {
        isLoading: true,
        heroClasses: [],
        deleteHeroClass: mockDeleteHeroClass,
      })
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  it("displays hero classes data when not loading", () => {
    render(
      React.createElement(MaintainClassesResults, {
        isLoading: false,
        heroClasses: mockHeroClasses,
        deleteHeroClass: mockDeleteHeroClass,
      })
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
      React.createElement(MaintainClassesResults, {
        isLoading: false,
        heroClasses: mockHeroClasses,
        deleteHeroClass: mockDeleteHeroClass,
      })
    );
    const deleteButtons = screen.getAllByRole("img", { hidden: true });
    fireEvent.click(deleteButtons[0]);
    expect(mockDeleteHeroClass).toHaveBeenCalled();
  });
  it("formats dates using getLastUpdatedString", () => {
    render(
      React.createElement(MaintainClassesResults, {
        isLoading: false,
        heroClasses: mockHeroClasses,
        deleteHeroClass: mockDeleteHeroClass,
      })
    );
    expect(screen.getByText("Mocked date for 2024-03-01")).toBeInTheDocument();
    expect(screen.getByText("Mocked date for 2024-03-02")).toBeInTheDocument();
  });
});
