"use client";

import { useState, useEffect } from "react";
import { FaSave, FaTimes, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/actions/db_product_actions";
import { getBrands } from "@/lib/actions/db_brand_actions";
import Toast from "@/lib/ui/components/Toast";
import BrandForm from "@/lib/ui/components/BrandForm";

interface AddProductFormProps {
  businessId: string;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
}

export default function AddProductForm({ businessId }: AddProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    brandId: "",
    imageUrl: "",
  });

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const brandsData = await getBrands();
      setBrands(brandsData);
    } catch (error) {
      console.error("Error loading brands:", error);
      showToast("Failed to load brands", "error");
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ message, type });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast("Please enter a valid price", "error");
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      showToast("Please enter a valid stock quantity", "error");
      return;
    }

    if (!formData.brandId) {
      showToast("Please select a brand", "error");
      return;
    }

    setIsLoading(true);
    try {
      await createProduct(
        formData.name.trim(),
        formData.description.trim() || null,
        parseFloat(formData.price),
        parseInt(formData.stock),
        businessId,
        formData.brandId
      );

      showToast("Product created successfully!", "success");

      // Redirect to product management page after a short delay
      setTimeout(() => {
        router.push("/vendor/products");
      }, 1500);
    } catch (error) {
      console.error("Error creating product:", error);
      showToast("Failed to create product. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/vendor/products");
  };

  const handleBrandCreated = (newBrand: { id: string; name: string }) => {
    // Add the new brand to the list and select it
    setBrands((prev) => [
      ...prev,
      {
        id: newBrand.id,
        name: newBrand.name,
        description: null,
        logo: null,
        website: null,
      },
    ]);
    setFormData((prev) => ({ ...prev, brandId: newBrand.id }));
    showToast("Brand created and selected!", "success");
  };

  return (
    <>
      {/* Product Creation Card */}
      <div className="card bg-base-100 shadow-sm border border-gray-300">
        <div className="card-body p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image - Left Side */}
            <div className="lg:w-1/2">
              <div className="card bg-base-100 shadow-sm border border-gray-300">
                <div className="card-body p-4">
                  <div className="relative">
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Product preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <FaPlus className="text-4xl mx-auto mb-2" />
                          <p>Product Image</p>
                          <p className="text-sm">Add image URL below</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Form - Right Side */}
            <div className="lg:w-1/2">
              <div className="card bg-base-100 shadow-sm border border-gray-300">
                <div className="card-body p-6 space-y-6">
                  <form onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={isLoading}
                        className="input input-bordered w-full"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        disabled={isLoading}
                        className="input input-bordered w-full"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          handleInputChange("stock", e.target.value)
                        }
                        disabled={isLoading}
                        className="input input-bordered w-full"
                        placeholder="0"
                        required
                      />
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Brand *
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={formData.brandId}
                          onChange={(e) =>
                            handleInputChange("brandId", e.target.value)
                          }
                          disabled={isLoading || isLoadingBrands}
                          className="select select-bordered flex-1"
                          required
                        >
                          <option value="">Select a brand</option>
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowBrandForm(true)}
                          className="btn btn-outline btn-primary gap-2"
                          disabled={isLoading}
                        >
                          <FaPlus className="text-sm" />
                          New Brand
                        </button>
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          handleInputChange("imageUrl", e.target.value)
                        }
                        disabled={isLoading}
                        className="input input-bordered w-full"
                        placeholder="https://example.com/image.jpg"
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
                        disabled={isLoading}
                        className="textarea textarea-bordered w-full h-32 resize-none"
                        placeholder="Enter product description"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary gap-2 flex-1"
                      >
                        <FaSave className="text-sm" />
                        {isLoading ? "Creating..." : "Create Product"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="btn btn-ghost gap-2"
                      >
                        <FaTimes className="text-sm" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Form Modal */}
      <BrandForm
        isOpen={showBrandForm}
        onClose={() => setShowBrandForm(false)}
        onBrandCreated={handleBrandCreated}
      />

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