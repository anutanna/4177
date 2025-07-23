import { getProducts } from "@/lib/actions/db_product_actions";
import ProductCard from "@/lib/ui/components/productCard";

export default async function LatestProductsSection() {
  const products = await getProducts();

  return (
    <section className="py-12 px-6">
      <h3 className="text-2xl font-bold mb-8 text-center">Latest Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.images?.[0]?.url || "/placeholder.jpg"}
            price={`${product.price}`}
            id={product.id}
          />
        ))}
      </div>
    </section>
  );
}
