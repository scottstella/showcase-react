import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MaintainSetsResults from "./MaintainSetsResults";
import type { Set } from "../../../dto/Set";

vi.mock("../../../common/utils", () => ({
  getLastUpdatedString: vi.fn(date => `Mocked date for ${date}`),
  getDateAndTimeString: vi.fn(date => `Mocked time for ${date}`),
}));

describe("MaintainSetsResults", () => {
  const mockSets: Set[] = [
    {
      id: 1,
      name: "Core",
      created_at: "2024-03-01",
      is_standard: true,
      release_date: "2020-01-15",
    },
    {
      id: 2,
      name: "Wild",
      created_at: "2024-03-02",
      is_standard: false,
      release_date: "2021-06-01",
    },
  ];

  const mockDeleteSet = vi.fn();

  it("shows loading message when loading", () => {
    render(<MaintainSetsResults isLoading={true} sets={[]} deleteSet={mockDeleteSet} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays sets when not loading", () => {
    render(<MaintainSetsResults isLoading={false} sets={mockSets} deleteSet={mockDeleteSet} />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Standard Set")).toBeInTheDocument();
    expect(screen.getByText("Release Date")).toBeInTheDocument();

    expect(screen.getByText("Core")).toBeInTheDocument();
    expect(screen.getByText("Wild")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("calls deleteSet when delete control is clicked", () => {
    render(<MaintainSetsResults isLoading={false} sets={mockSets} deleteSet={mockDeleteSet} />);

    fireEvent.click(screen.getAllByTestId("delete-set")[0]);
    expect(mockDeleteSet).toHaveBeenCalled();
  });

  it("formats last updated via getLastUpdatedString", () => {
    render(<MaintainSetsResults isLoading={false} sets={mockSets} deleteSet={mockDeleteSet} />);

    expect(screen.getByText("Mocked date for 2024-03-01")).toBeInTheDocument();
    expect(screen.getByText("Mocked date for 2024-03-02")).toBeInTheDocument();
  });
});
