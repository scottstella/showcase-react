import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  it("returns first page items and boundaries", () => {
    const items = Array.from({ length: 12 }, (_, i) => i + 1);
    const { result } = renderHook(() =>
      usePagination({
        items,
        initialPageSize: 5,
      })
    );

    expect(result.current.pagedItems).toEqual([1, 2, 3, 4, 5]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.startItem).toBe(1);
    expect(result.current.endItem).toBe(5);
  });

  it("moves pages and clamps bounds", () => {
    const items = Array.from({ length: 7 }, (_, i) => i + 1);
    const { result } = renderHook(() =>
      usePagination({
        items,
        initialPageSize: 3,
      })
    );

    act(() => result.current.goToNextPage());
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pagedItems).toEqual([4, 5, 6]);

    act(() => result.current.setPage(999));
    expect(result.current.currentPage).toBe(3);
    expect(result.current.pagedItems).toEqual([7]);

    act(() => result.current.setPage(-10));
    expect(result.current.currentPage).toBe(1);
  });

  it("resets to first page when page size changes", () => {
    const items = Array.from({ length: 12 }, (_, i) => i + 1);
    const { result } = renderHook(() =>
      usePagination({
        items,
        initialPageSize: 4,
      })
    );

    act(() => result.current.setPage(2));
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pagedItems).toEqual([5, 6, 7, 8]);

    act(() => result.current.setPageSize(10));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pagedItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
