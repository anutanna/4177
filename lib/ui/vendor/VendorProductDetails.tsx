"use client";

import { useState } from "react";
import Image from "next/image";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import VendorPageLayout from "@/lib/ui/dashboard/VendorPageLayout";
import Toast from "@/lib/ui/components/Toast";
import { updateProduct, deleteProduct } from "@/lib/actions/db_product_actions";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    images: { url: string }[];
    business: {
      id: string;
      name: string;
      logo: string | null;
    };
    brand: {
      id: string;
      name: string;
    };
  };
  business: {
    id: string;
    name: string;
    logo: string | null;
  };
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function VendorProductDetails({
  product,
  business,
}: ProductDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state - simplified to match mockup
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    price: product.price.toString(),
    stock: product.stock.toString(),
    brandName: product.brand.name,
  });

  const imageUrl = product.images[0]?.url || "/no-image.svg";

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ message, type });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      brandName: product.brand.name,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProduct(
        product.id,
        formData.name,
        formData.description || null,
        parseFloat(formData.price),
        parseInt(formData.stock)
      );

      setIsEditing(false);
      showToast("Product updated successfully!", "success");
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error("Error updating product:", error);
      showToast("Failed to update product. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteProduct(product.id);
      showToast("Product deleted successfully!", "success");

      // Redirect to product management page after a short delay
      setTimeout(() => {
        router.push("/vendor/products");
      }, 1500);
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Failed to delete product. Please try again.", "error");
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <VendorPageLayout
        pageTitle="Product Management"
        backgroundImage="/hero-bg.jpg"
        vendorName={business.name}
        vendorLogo={business.logo || "/placeholder-logo.svg"}
        activeTab="Product Management"
        sectionTitle="Product Details"
        actionButton={
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  className="btn btn-primary gap-2"
                  onClick={handleEdit}
                  disabled={isLoading}
                >
                  <FaEdit className="text-sm" />
                  Edit
                </button>
                <button
                  className="btn btn-error gap-2"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <FaTrash className="text-sm" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-success gap-2"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <FaSave className="text-sm" />
                  {isLoading ? "Saving..." : "Update"}
                </button>
                <button
                  className="btn btn-ghost gap-2"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <FaTimes className="text-sm" />
                  Cancel
                </button>
              </>
            )}
          </div>
        }
      >
        {/* Product Details Card */}
        <div className="card bg-base-100 shadow-sm border border-gray-300">
          <div className="card-body p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Product Image - Left Side */}
              <div className="lg:w-1/2">
                <div className="card bg-base-100 shadow-sm border border-gray-300">
                  <div className="card-body p-4">
                    <div className="relative">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="rounded-lg object-cover w-full max-h-[500px]"
                      />
                      {/* Image Controls */}
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button className="btn btn-circle btn-sm bg-blue-500 hover:bg-blue-600 border-none">
                          <FaEdit className="text-white text-xs" />
                        </button>
                        <button className="btn btn-circle btn-sm bg-red-700 hover:bg-red-800 border-none">
                          <FaTrash className="text-white text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Form - Right Side */}
              <div className="lg:w-1/2">
                <div className="card bg-base-100 shadow-sm border border-gray-300">
                  <div className="card-body p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!isEditing}
                        className="input input-bordered w-full"
                        placeholder="Enter product name"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        disabled={!isEditing}
                        className="input input-bordered w-full"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          handleInputChange("stock", e.target.value)
                        }
                        disabled={!isEditing}
                        className="input input-bordered w-full"
                        placeholder="0"
                      />
                    </div>

                    {/* Company / Brand Name */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={formData.brandName}
                        onChange={(e) =>
                          handleInputChange("brandName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="input input-bordered w-full"
                        placeholder="Enter brand name"
                      />
                    </div>

                    {/* Product Details (Description) */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Product Details
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        disabled={!isEditing}
                        className="textarea textarea-bordered w-full h-32 resize-none"
                        placeholder="Enter product description"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VendorPageLayout>

      {/* Toast Component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
