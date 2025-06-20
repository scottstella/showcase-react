/// <reference types="vitest/globals" />
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Refreshed from "./Refreshed";
import { getDateAndTimeString } from "./utils";
// Mock the utils function
vi.mock("./utils", () => ({
  getDateAndTimeString: vi.fn(),
}));
describe("Refreshed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the date to ensure consistent test results
    const mockDate = new Date("2024-03-06T12:00:00Z");
    const mockDateString = "3/6/2024 - 12:00:00 PM";
    vi.spyOn(global, "Date").mockImplementation(() => mockDate);
    getDateAndTimeString.mockReturnValue(mockDateString);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("displays loading message when loading is true", () => {
    render(React.createElement(Refreshed, { loading: true }));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  it("displays refresh message with current date/time when not loading", () => {
    render(React.createElement(Refreshed, { loading: false }));
    expect(screen.getByText("Data refreshed on 3/6/2024 - 12:00:00 PM")).toBeInTheDocument();
    expect(getDateAndTimeString).toHaveBeenCalledTimes(1);
    expect(getDateAndTimeString).toHaveBeenCalledWith(new Date("2024-03-06T12:00:00Z"));
  });
  it("updates message when loading prop changes", () => {
    const { rerender } = render(React.createElement(Refreshed, { loading: true }));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    rerender(React.createElement(Refreshed, { loading: false }));
    expect(screen.getByText("Data refreshed on 3/6/2024 - 12:00:00 PM")).toBeInTheDocument();
  });
});
