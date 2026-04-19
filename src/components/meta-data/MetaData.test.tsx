import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MetaData from "./MetaData";

vi.mock("./MaintainClasses/MaintainClasses", () => ({
  default: () => <div data-testid="maintain-classes">Classes Panel</div>,
}));

vi.mock("./MaintainSets/MaintainSets", () => ({
  default: () => <div data-testid="maintain-sets">Sets Panel</div>,
}));

vi.mock("./MaintainTribes/MaintainTribes", () => ({
  default: () => <div data-testid="maintain-tribes">Tribes Panel</div>,
}));

describe("MetaData", () => {
  it("prompts for a selection before choosing a section", () => {
    render(<MetaData />);
    expect(screen.getByText(/make a selection/i)).toBeInTheDocument();
  });

  it("renders MaintainSets when Sets is chosen", () => {
    render(<MetaData />);
    fireEvent.click(screen.getByText("Sets"));
    expect(screen.getByTestId("maintain-sets")).toBeInTheDocument();
    expect(screen.queryByText(/make a selection/i)).not.toBeInTheDocument();
  });

  it("renders MaintainClasses when Hero Classes is chosen", () => {
    render(<MetaData />);
    fireEvent.click(screen.getByText("Hero Classes"));
    expect(screen.getByTestId("maintain-classes")).toBeInTheDocument();
  });

  it("renders MaintainTribes when Tribes is chosen", () => {
    render(<MetaData />);
    fireEvent.click(screen.getByText("Tribes"));
    expect(screen.getByTestId("maintain-tribes")).toBeInTheDocument();
  });
});
