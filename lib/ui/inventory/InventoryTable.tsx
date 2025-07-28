"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaTrash } from "react-icons/fa";
import { deleteProduct } from "@/lib/actions/db_product_actions";
import { useRouter } from "next/navigation";

interface InventoryProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  status: "Visible" | "Not Visible";
}

interface InventoryTableProps {
  products: InventoryProduct[];
}

export default function InventoryTable({ products }: InventoryTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const getStatusStyle = (status: InventoryProduct["status"]) => {
    switch (status) {
      case "Visible":
        return "badge badge-success";
      case "Not Visible":
        return "badge badge-error";
      default:
        return "badge badge-neutral";
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(productId);
    try {
      await deleteProduct(productId);
      // Refresh the page to show updated product list
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="table table-zebra w-full">
          {/* Table Head */}
          <thead className="bg-base-200">
            <tr>
              <th className="font-bold text-base-content">Product#</th>
              <th className="font-bold text-base-content">Description</th>
              <th className="font-bold text-base-content">Price</th>
              <th className="font-bold text-base-content">Quantity</th>
              <th className="font-bold text-base-content">Status</th>
              <th className="font-bold text-base-content">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product.id} className="hover">
                {/* Product Number */}
                <td>
                  <span className="font-bold text-base-content">
                    #{(startIndex + index + 1).toString().padStart(3, "0")}
                  </span>
                </td>

                {/* Description with Image */}
                <td>
                  <div className="flex items-center gap-3">
                    {/* Small product image */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base-content">
                        {product.name}
                      </div>
                      <div className="text-sm text-base-content/60 line-clamp-2">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td>
                  <span className="font-bold text-base-content">
                    ${product.price.toFixed(2)}
                  </span>
                </td>

                {/* Quantity */}
                <td>
                  <span className="font-bold text-base-content">
                    {product.quantity}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <span className={getStatusStyle(product.status)}>
                    {product.status}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="flex items-center gap-2">
                    {/* View button - blue circle with white eye */}
                    <Link
                      href={`/vendor/products/${product.id}`}
                      className="btn btn-circle btn-sm bg-blue-500 hover:bg-blue-600 border-none"
                      title="View Product"
                    >
                      <FaEye className="text-white text-xs" />
                    </Link>
                    {/* Delete button - dark red circle with white trash */}
                    <button
                      className="btn btn-circle btn-sm bg-red-700 hover:bg-red-800 border-none"
                      title="Delete Product"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={isDeleting === product.id}
                    >
                      {isDeleting === product.id ? (
                        <div className="loading loading-spinner loading-xs text-white"></div>
                      ) : (
                        <FaTrash className="text-white text-xs" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className="join-item btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              «
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={`join-item btn ${
                  currentPage === page ? "btn-active" : ""
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="join-item btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
