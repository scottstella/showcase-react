import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./PaginationControls.css";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  startItem,
  endItem,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  return (
    <div className="pagination-controls" data-testid="pagination-controls">
      <div className="pagination-summary" data-testid="pagination-summary">
        {totalItems === 0 ? "No results" : `${startItem}-${endItem} of ${totalItems}`}
      </div>

      <div className="pagination-size">
        <label htmlFor="page-size-select">Rows:</label>
        <select
          id="page-size-select"
          data-testid="page-size-select"
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="pagination-nav">
        <button
          type="button"
          aria-label="Previous page"
          data-testid="prev-page"
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <span className="pagination-page-indicator" data-testid="page-indicator">
          Page {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          aria-label="Next page"
          data-testid="next-page"
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
