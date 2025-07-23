import { Suspense } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { getRandomBrands } from "@/lib/actions/db_brand_actions";

// Skeleton component for loading state
function BrandsSkeleton() {
  return (
    <section className="hidden md:block py-6 border-gray-200 bg-white mt-5 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="flex items-center justify-center gap-2 text-xl font-medium text-gray-700 mb-6">
          <FaStar className="text-yellow-400" />
          Featured Brands
        </h2>
        <div className="flex justify-center items-center gap-24 max-w-4xl mx-auto">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
            >
              <div className="w-28 h-28 rounded-full border border-gray-300 shadow-sm overflow-hidden flex items-center justify-center  skeleton"></div>
              <div className="w-16 h-4 rounded skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main brands content component
async function BrandsContent() {
  const brands = await getRandomBrands(5);

  return (
    <section className="hidden md:block py-6 border-gray-200 bg-white mt-5 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="flex items-center justify-center gap-2 text-xl font-medium text-gray-700 mb-6">
          <FaStar className="text-yellow-400" />
          Featured Brands
        </h2>
        <div className="flex justify-center items-center gap-24 max-w-4xl mx-auto">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
            >
              <div className="w-28 h-28 rounded-full border border-gray-300 shadow-sm hover:shadow-md overflow-hidden flex items-center justify-center bg-white hover:bg-gradient-to-r from-[#21C1B9] to-[#1A71D5] transition-all duration-500">
                <Image
                  src={brand.logo || "/placeholder-logo.svg"}
                  alt={`${brand.name} logo`}
                  width={102}
                  height={102}
                  className="object-contain rounded-full cursor-pointer"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-600 m-0">
                {brand.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main component with Suspense
export default function BrandsSection() {
  return (
    <Suspense fallback={<BrandsSkeleton />}>
      <BrandsContent />
    </Suspense>
  );
}
