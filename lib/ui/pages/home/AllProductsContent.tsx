"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/lib/ui/components/productCard";
import { getProductsPaginated } from "@/lib/actions/db_product_actions";
import PaginationWrapper from "@/lib/ui/pages/home/PaginationWrapper";
import AllProductsSkeleton from "@/lib/ui/pages/home/AllProductsSkeleton";

interface AllProductsContentProps {
  page?: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  limit: number;
}

export default function AllProductsContent({
  page = 1,
}: AllProductsContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getProductsPaginated(page, 15);
        setProducts(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  if (isLoading) {
    return <AllProductsSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No products available
      </div>
    );
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.images[0]?.url || "/placeholder.jpg"}
            price={product.price.toString()}
            id={product.id}
          />
        ))}
      </div>

      {/* Pagination Wrapper - Client Component */}
      {pagination && (
        <PaginationWrapper
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}

      {/* Products count info */}
      {pagination && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Showing {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
          {Math.min(
            pagination.currentPage * pagination.limit,
            pagination.totalCount
          )}{" "}
          of {pagination.totalCount} products
        </div>
      )}
    </div>
  );
}
