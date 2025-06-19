import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MaintainTribesResults from "./MaintainTribesResults";
import type { Tribe } from "../../../dto/Tribe";

// Mock the utils functions
vi.mock("../../../common/utils", () => ({
  getLastUpdatedString: vi.fn(date => `Mocked date for ${date}`),
  getDateAndTimeString: vi.fn(date => `Mocked time for ${date}`),
}));

describe("MaintainTribesResults", () => {
  const mockTribes: Tribe[] = [
    { id: 1, name: "Murloc", created_at: "2024-03-01" },
    { id: 2, name: "Dragon", created_at: "2024-03-02" },
  ];

  const mockDeleteTribe = vi.fn();

  it("displays loading message when loading", () => {
    render(<MaintainTribesResults isLoading={true} tribes={[]} deleteTribe={mockDeleteTribe} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays tribes data when not loading", () => {
    render(
      <MaintainTribesResults isLoading={false} tribes={mockTribes} deleteTribe={mockDeleteTribe} />
    );

    // Check for table headers
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Last Updated")).toBeInTheDocument();

    // Check for tribe data
    expect(screen.getByText("Murloc")).toBeInTheDocument();
    expect(screen.getByText("Dragon")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls deleteTribe when delete icon is clicked", () => {
    render(
      <MaintainTribesResults isLoading={false} tribes={mockTribes} deleteTribe={mockDeleteTribe} />
    );

    const deleteButtons = screen.getAllByRole("img", { hidden: true });
    fireEvent.click(deleteButtons[0]);

    expect(mockDeleteTribe).toHaveBeenCalled();
  });

  it("formats dates using getLastUpdatedString", () => {
    render(
      <MaintainTribesResults isLoading={false} tribes={mockTribes} deleteTribe={mockDeleteTribe} />
    );

    expect(screen.getByText("Mocked date for 2024-03-01")).toBeInTheDocument();
    expect(screen.getByText("Mocked date for 2024-03-02")).toBeInTheDocument();
  });
});
