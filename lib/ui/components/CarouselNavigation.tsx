"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CarouselNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  isMobile?: boolean;
}

export default function CarouselNavigation({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  isMobile = false,
}: CarouselNavigationProps) {
  if (isMobile) {
    return (
      <>
        <button
          onClick={onPrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-sm bg-white/90 hover:bg-gradient-to-r hover:from-[#21C1B9] hover:to-[#1A71D5] hover:text-white border-gray-300 shadow-lg z-10"
          disabled={!canGoPrev}
        >
          <FaChevronLeft className="text-sm" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-sm bg-white/90 hover:bg-gradient-to-r hover:from-[#21C1B9] hover:to-[#1A71D5] hover:text-white border-gray-300 shadow-lg z-10"
          disabled={!canGoNext}
        >
          <FaChevronRight className="text-sm" />
        </button>
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="btn btn-circle btn-outline btn-sm hover:bg-gradient-to-b hover:from-[#21C1B9] hover:to-[#1A71D5] hover:text-white"
        disabled={!canGoPrev}
      >
        <FaChevronLeft className="text-sm" />
      </button>
      <button
        onClick={onNext}
        className="btn btn-circle btn-outline btn-sm hover:bg-gradient-to-b hover:from-[#21C1B9] hover:to-[#1A71D5] hover:text-white"
        disabled={!canGoNext}
      >
        <FaChevronRight className="text-sm" />
      </button>
    </div>
  );
}
