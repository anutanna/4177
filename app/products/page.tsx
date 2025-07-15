"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/lib/ui/components/productCard";

type Product = {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
};

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filteredResults = products.filter((p) =>
      p.name.toLowerCase().includes(lower)
    );
    setFiltered(filteredResults);
  }, [searchTerm, products]);

  const productsToShow = searchTerm ? filtered : products;

  return (
    <section className="p-6">
      <h2 className="text-center text-2xl font-bold mb-4">All Products</h2>
      {searchTerm && filtered.length === 0 ? (
        <p className="text-center text-gray-500">No results found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {productsToShow.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.images[0]?.url || "/placeholder.jpg"}
              price={`${product.price}`}
              id={product.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
