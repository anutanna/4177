export default function AllProductsSkeleton() {
  return (
    <div>
      {/* Products Grid Skeleton - showing 15 items to match the actual products count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className="card w-full max-w-xs bg-white shadow-md hover:shadow-lg transition-shadow duration-300 animate-pulse"
          >
            <figure className="px-4 pt-4">
              <div className="rounded-xl h-40 w-full bg-gray-300 skeleton"></div>
            </figure>
            <div className="card-body items-center text-center pb-4 p-4">
              {/* Title skeleton - matching the 2-line title with height h-12 */}
              <div className="h-12 bg-gray-300 rounded w-3/4 mb-2 skeleton flex items-center justify-center"></div>
              {/* Price skeleton with icon placeholder */}
              <div className="w-full text-center mt-2 mb-4 flex items-center justify-center gap-1">
                <div className="h-6 bg-gray-300 rounded w-16 skeleton"></div>
                <div className="h-4 w-4 bg-gray-300 rounded skeleton ml-2"></div>
              </div>
              {/* Button skeleton - matching the button layout */}
              <div className="flex items-center gap-2 w-full">
                <div className="h-10 bg-gray-300 rounded flex-1 skeleton"></div>
                <div className="w-10 h-10 bg-gray-300 rounded skeleton"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center">
        <div className="join">
          <div className="join-item btn btn-disabled skeleton w-16"></div>
          <div className="join-item btn btn-disabled skeleton w-8"></div>
          <div className="join-item btn btn-disabled skeleton w-8"></div>
          <div className="join-item btn btn-disabled skeleton w-8"></div>
          <div className="join-item btn btn-disabled skeleton w-16"></div>
        </div>
      </div>
    </div>
  );
}
