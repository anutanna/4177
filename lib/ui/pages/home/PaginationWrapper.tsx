"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useState } from "react";
import Pagination from "./Pagination";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
}

export default function PaginationWrapper({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePageChange = (page: number) => {
    // Don't handle page changes if disabled or already navigating
    if (disabled || isNavigating) return;

    // Immediately scroll to section for better UX
    const section = document.querySelector('[data-section="all-products"]');
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }

    // If parent provides onPageChange, use it for optimistic updates
    if (onPageChange) {
      onPageChange(page);
      return;
    }

    // Set navigating state to prevent multiple clicks
    setIsNavigating(true);

    // Use startTransition for navigation to ensure Suspense boundaries work
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `/?${queryString}` : "/";

      // Use replace for consistent behavior with Next.js 15 router
      router.replace(url, { scroll: false });

      // Reset navigating state after a brief delay
      setTimeout(() => setIsNavigating(false), 100);
    });
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      disabled={disabled || isNavigating}
    />
  );
}
