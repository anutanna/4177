export default function ProductsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Filters Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="h-10 bg-gray-200 rounded w-full md:w-64"></div>
        <div className="h-10 bg-gray-200 rounded w-full md:w-64"></div>
        <div className="h-10 bg-gray-200 rounded w-full md:w-32"></div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
