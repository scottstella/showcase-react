import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PaginationControls from "./PaginationControls";

describe("PaginationControls", () => {
  it("shows summary and page indicator", () => {
    render(
      <PaginationControls
        currentPage={2}
        totalPages={4}
        totalItems={23}
        startItem={6}
        endItem={10}
        pageSize={5}
        pageSizeOptions={[5, 10, 25]}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByTestId("pagination-summary")).toHaveTextContent("6-10 of 23");
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 2 / 4");
  });

  it("invokes callbacks for page and page size changes", () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <PaginationControls
        currentPage={2}
        totalPages={3}
        totalItems={12}
        startItem={6}
        endItem={10}
        pageSize={5}
        pageSizeOptions={[5, 10]}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    fireEvent.click(screen.getByTestId("prev-page"));
    fireEvent.click(screen.getByTestId("next-page"));
    fireEvent.change(screen.getByTestId("page-size-select"), { target: { value: "10" } });

    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });

  it("disables nav buttons at boundaries", () => {
    const onPageChange = vi.fn();

    render(
      <PaginationControls
        currentPage={1}
        totalPages={1}
        totalItems={0}
        startItem={0}
        endItem={0}
        pageSize={5}
        pageSizeOptions={[5]}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByTestId("pagination-summary")).toHaveTextContent("No results");
    expect(screen.getByTestId("prev-page")).toBeDisabled();
    expect(screen.getByTestId("next-page")).toBeDisabled();
  });
});
