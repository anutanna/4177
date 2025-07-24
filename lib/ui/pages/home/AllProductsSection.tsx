import { FaBoxOpen } from "react-icons/fa";
import AllProductsContent from "@/lib/ui/pages/home/AllProductsContent";

interface AllProductsSectionProps {
  currentPage: number;
}

export default function AllProductsSection({
  currentPage,
}: AllProductsSectionProps) {
  return (
    <section className="py-12 px-4 sm:px-6" data-section="all-products">
      {/* All Section Title with Icon */}
      <div className="flex items-center gap-3 mb-8">
        <FaBoxOpen className="text-blue-600 text-2xl" />
        <h3 className="text-2xl font-bold">All Products</h3>
      </div>

      {/* Products Content - Handles its own loading state */}
      <AllProductsContent key={currentPage} page={currentPage} />
    </section>
  );
}
