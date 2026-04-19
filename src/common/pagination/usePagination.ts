import { useEffect, useMemo, useState } from "react";

interface UsePaginationOptions<T> {
  items: T[];
  initialPageSize: number;
}

export interface PaginationState<T> {
  pagedItems: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export function usePagination<T>({
  items,
  initialPageSize,
}: UsePaginationOptions<T>): PaginationState<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  useEffect(() => {
    setCurrentPage(prev => Math.min(prev, totalPages));
  }, [totalPages]);

  const pagedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const setPage = (page: number) => {
    const boundedPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(boundedPage);
  };

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  };

  return {
    pagedItems,
    currentPage: safeCurrentPage,
    totalPages,
    pageSize,
    totalItems,
    startItem: totalItems === 0 ? 0 : startIndex + 1,
    endItem: Math.min(endIndex, totalItems),
    setPage,
    setPageSize,
    goToNextPage: () => setPage(safeCurrentPage + 1),
    goToPreviousPage: () => setPage(safeCurrentPage - 1),
  };
}
