"use client";

import { useState, useEffect } from "react";
import ProductCard from "./productCard";
import CarouselNavigation from "@/lib/ui/components/CarouselNavigation";

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
}

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);

  // Handle responsive visible cards
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width >= 1280) setVisibleCards(5); // xl
      else if (width >= 1024) setVisibleCards(4); // lg
      else if (width >= 768) setVisibleCards(3); // md
      else if (width >= 640) setVisibleCards(2); // sm
      else setVisibleCards(1); // mobile
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500">No products available</div>
    );
  }

  return (
    <div>
      {/* Navigation Arrows - Desktop */}
      <div className="hidden sm:flex justify-end items-center gap-2 mb-4">
        <CarouselNavigation
          onPrev={prevSlide}
          onNext={nextSlide}
          canGoPrev={currentIndex > 0}
          canGoNext={currentIndex < maxIndex}
        />
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-x-hidden pb-4">
        {/* Products Carousel */}
        <div
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleCards}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{
                width: `calc((100% - ${
                  (visibleCards - 1) * 16
                }px) / ${visibleCards})`,
              }}
            >
              <ProductCard
                name={product.name}
                image={product.images?.[0]?.url || "/placeholder.jpg"}
                price={`${product.price}`}
                id={product.id}
              />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Arrows - Positioned over carousel */}
        {products.length > visibleCards && (
          <div className="sm:hidden">
            <CarouselNavigation
              onPrev={prevSlide}
              onNext={nextSlide}
              canGoPrev={currentIndex > 0}
              canGoNext={currentIndex < maxIndex}
              isMobile={true}
            />
          </div>
        )}
      </div>

      {/* Carousel Indicators - Mobile */}
      {products.length > visibleCards && (
        <div className="flex justify-center mt-6 sm:hidden">
          <div className="flex space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  currentIndex === index ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
