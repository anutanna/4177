"use client";

import { useState, useEffect } from "react";
import { getProductsWithFilters } from "@/lib/actions/db_product_actions";
import { getCategories } from "@/lib/actions/db_category_actions";
import ProductCard from "@/lib/ui/components/productCard";
import PaginationWrapper from "@/lib/ui/pages/home/PaginationWrapper";

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  business: { name: string };
  brand: { name: string };
  categories: { category: { id: string; name: string } }[];
  subCategories: {
    subCategory: {
      id: string;
      name: string;
      category: { id: string; name: string };
    };
  }[];
}

interface Category {
  id: string;
  name: string;
  subCategories: { id: string; name: string }[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  limit: number;
}

interface ProductsContentProps {
  page: number;
  categoryId?: string;
  subCategoryId?: string;
  searchQuery?: string;
}

export default function ProductsContent({
  page,
  categoryId,
  subCategoryId,
  searchQuery,
}: ProductsContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryId || ""
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    subCategoryId || ""
  );

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };

    loadCategories();
  }, []);

  // Load products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getProductsWithFilters(
          page,
          15,
          selectedCategory || undefined,
          selectedSubCategory || undefined,
          searchQuery
        );
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
  }, [page, selectedCategory, selectedSubCategory, searchQuery]);

  // Update selected filters when props change
  useEffect(() => {
    setSelectedCategory(categoryId || "");
    setSelectedSubCategory(subCategoryId || "");
  }, [categoryId, subCategoryId]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory when category changes

    // Update URL
    const url = new URL(window.location.href);
    if (categoryId) {
      url.searchParams.set("category", categoryId);
    } else {
      url.searchParams.delete("category");
    }
    url.searchParams.delete("subcategory");
    url.searchParams.delete("page");
    window.history.pushState({}, "", url.toString());
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);

    // Update URL
    const url = new URL(window.location.href);
    if (subCategoryId) {
      url.searchParams.set("subcategory", subCategoryId);
    } else {
      url.searchParams.delete("subcategory");
    }
    url.searchParams.delete("page");
    window.history.pushState({}, "", url.toString());
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    url.searchParams.delete("subcategory");
    url.searchParams.delete("page");
    window.history.pushState({}, "", url.toString());
  };

  const getFilteredSubCategories = () => {
    if (!selectedCategory) return [];
    const category = categories.find((c) => c.id === selectedCategory);
    return category?.subCategories || [];
  };

  const getSelectedCategoryName = () => {
    const category = categories.find((c) => c.id === selectedCategory);
    return category?.name;
  };

  const getSelectedSubCategoryName = () => {
    const subCategories = getFilteredSubCategories();
    const subCategory = subCategories.find(
      (sc) => sc.id === selectedSubCategory
    );
    return subCategory?.name;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div>
      {/* Filters */}
      {!searchQuery && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter */}
            {selectedCategory && (
              <div className="flex-1">
                <label
                  htmlFor="subcategory"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  value={selectedSubCategory}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Subcategories</option>
                  {getFilteredSubCategories().map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear Filters */}
            {(selectedCategory || selectedSubCategory) && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || selectedSubCategory) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Category: {getSelectedCategoryName()}
                </span>
              )}
              {selectedSubCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Subcategory: {getSelectedSubCategoryName()}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {searchQuery
            ? `No products found for "${searchQuery}"`
            : "No products available"}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                image={product.images[0]?.url || "/no-image.svg"}
                price={product.price}
                id={product.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
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
        </>
      )}
    </div>
  );
}
