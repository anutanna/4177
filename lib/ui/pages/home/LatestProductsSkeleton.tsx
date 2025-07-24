import { MdFiberNew } from "react-icons/md";

export default function LatestProductsSkeleton() {
  return (
    <section className="py-12 px-4 sm:px-6">
      {/* Section Title with Icon - Left Aligned */}
      <div className="flex items-center gap-3 mb-8">
        <MdFiberNew className="text-green-600 text-2xl" />
        <h3 className="text-2xl font-bold">Latest Products</h3>
      </div>

      <div>
        {/* Navigation Arrows - Desktop */}
        <div className="hidden sm:flex justify-end items-center gap-2 mb-4">
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full skeleton"></div>
            <div className="w-10 h-10 bg-gray-300 rounded-full skeleton"></div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-x-hidden pb-4">
          {/* Products Carousel Skeleton */}
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{
                  width: `calc((100% - 64px) / 5)`,
                }}
              >
                <div className="card w-full max-w-xs bg-white shadow-md hover:shadow-lg transition-shadow duration-300 animate-pulse">
                  <figure className="px-4 pt-4">
                    <div className="rounded-xl h-40 w-full bg-gray-300 skeleton"></div>
                  </figure>
                  <div className="card-body items-center text-center pb-4 p-4">
                    {/* Title skeleton */}
                    <div className="h-12 bg-gray-300 rounded w-3/4 mb-2 skeleton"></div>
                    {/* Price skeleton */}
                    <div className="w-full text-center mt-2 mb-4 flex items-center justify-center gap-1">
                      <div className="h-6 bg-gray-300 rounded w-16 skeleton"></div>
                      <div className="h-4 w-4 bg-gray-300 rounded skeleton ml-2"></div>
                    </div>
                    {/* Button skeleton */}
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-10 bg-gray-300 rounded flex-1 skeleton"></div>
                      <div className="w-10 h-10 bg-gray-300 rounded skeleton"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
