import { Suspense } from "react";
import ProductsContent from "@/lib/ui/pages/products/ProductsContent";
import ProductsSkeleton from "@/lib/ui/pages/products/ProductsSkeleton";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    subcategory?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const categoryId = resolvedSearchParams?.category;
  const subCategoryId = resolvedSearchParams?.subcategory;
  const searchQuery = resolvedSearchParams?.search;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        {searchQuery && (
          <p className="text-gray-600 mt-2">
            Search results for:{" "}
            <span className="font-semibold">&ldquo;{searchQuery}&rdquo;</span>
          </p>
        )}
        {categoryId && !searchQuery && (
          <p className="text-gray-600 mt-2">Browsing category</p>
        )}
      </div>

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent
          page={currentPage}
          categoryId={categoryId}
          subCategoryId={subCategoryId}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  );
}
