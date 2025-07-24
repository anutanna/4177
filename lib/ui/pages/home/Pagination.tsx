"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        {/* Previous button */}
        <button
          className={`join-item btn ${
            currentPage === 1 || disabled ? "btn-disabled" : ""
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
        >
          Previous
        </button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <button
            key={index}
            className={`join-item btn ${
              page === currentPage ? "btn-active" : ""
            } ${page === "..." || disabled ? "btn-disabled" : ""}`}
            onClick={() =>
              typeof page === "number" && !disabled
                ? onPageChange(page)
                : undefined
            }
            disabled={page === "..." || disabled}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          className={`join-item btn ${
            currentPage === totalPages || disabled ? "btn-disabled" : ""
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
        >
          Next
        </button>
      </div>
    </div>
  );
}
