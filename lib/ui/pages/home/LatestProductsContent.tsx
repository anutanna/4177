import { MdFiberNew } from "react-icons/md";
import ProductCarousel from "@/lib/ui/components/ProductCarousel";
import { getLatestProducts } from "@/lib/actions/db_product_actions";

export default async function LatestProductsContent() {
  // Fetch products on the server
  const products = await getLatestProducts(10);

  if (products.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <MdFiberNew className="text-green-600 text-xl" />
          <h3 className="text-2xl font-bold">Latest Products</h3>
        </div>
        <div className="text-center text-gray-500">No products available</div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6">
      {/* Section Title with Icon - Left Aligned */}
      <div className="flex items-center gap-3 mb-8">
        <MdFiberNew className="text-green-600 text-2xl" />
        <h3 className="text-2xl font-bold">Latest Products</h3>
      </div>

      {/* Product Carousel - Client Component */}
      <ProductCarousel products={products} />
    </section>
  );
}
