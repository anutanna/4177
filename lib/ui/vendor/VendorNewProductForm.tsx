"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaSave, FaTimes, FaPlus } from "react-icons/fa";
import VendorPageLayout from "@/lib/ui/dashboard/VendorPageLayout";
import Toast from "@/lib/ui/components/Toast";
import BrandForm from "@/lib/ui/components/BrandForm";
import CategoryForm from "@/lib/ui/components/CategoryForm";
import { createProductWithCategories } from "@/lib/actions/db_product_actions";
import { getBrands } from "@/lib/actions/db_brand_actions";
import { getCategories } from "@/lib/actions/db_category_actions";
import { useRouter } from "next/navigation";
import { ProductStatus } from "@prisma/client";

interface NewProductFormProps {
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

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
}

export default function VendorNewProductForm({
  business,
}: NewProductFormProps) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);

  // Form state - initial empty state for new product
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: ProductStatus.VISIBLE,
    brandId: "",
    categoryIds: [] as string[],
    subCategoryIds: [] as string[],
    imageUrl: "",
  });

  const imageUrl = formData.imageUrl || "/no-image.svg";

  // Load brands and categories on component mount
  const loadBrandsAndCategories = useCallback(async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        getBrands(),
        getCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);

      // Set default brand if available
      if (brandsData.length > 0 && !formData.brandId) {
        setFormData((prev) => ({ ...prev, brandId: brandsData[0].id }));
      }

      // Filter subcategories based on selected categories
      updateFilteredSubCategories(formData.categoryIds, categoriesData);
    } catch (error) {
      console.error("Error loading brands and categories:", error);
      showToast("Failed to load brands and categories", "error");
    }
  }, [formData.categoryIds, formData.brandId]);

  useEffect(() => {
    loadBrandsAndCategories();
  }, [loadBrandsAndCategories]);

  const updateFilteredSubCategories = (
    selectedCategoryIds: string[],
    allCategories: Category[]
  ) => {
    const subcats = allCategories
      .filter((cat) => selectedCategoryIds.includes(cat.id))
      .flatMap((cat) => cat.subCategories || []);
    setFilteredSubCategories(subcats);
  };

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ message, type });
  };

  const handleCancel = () => {
    router.push("/inventory");
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast("Valid price is required", "error");
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      showToast("Valid stock quantity is required", "error");
      return;
    }
    if (!formData.brandId) {
      showToast("Please select a brand", "error");
      return;
    }

    setIsLoading(true);
    try {
      const newProduct = await createProductWithCategories(
        formData.name,
        formData.description || null,
        parseFloat(formData.price),
        parseInt(formData.stock),
        business.id,
        formData.brandId,
        formData.categoryIds,
        formData.subCategoryIds,
        formData.imageUrl,
        formData.status
      );

      showToast("Product created successfully!", "success");

      // Redirect to the new product's details page or inventory
      setTimeout(() => {
        if (newProduct) {
          router.push(`/vendor/products/${newProduct.id}`);
        } else {
          router.push("/inventory");
        }
      }, 1500);
    } catch (error) {
      console.error("Error creating product:", error);
      showToast("Failed to create product. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // If categories changed, update filtered subcategories
      if (field === "categoryIds") {
        updateFilteredSubCategories(value as string[], categories);
        // Clear subcategory selections that are no longer valid
        const validSubCategoryIds = filteredSubCategories
          .filter((subcat) => (value as string[]).includes(subcat.categoryId))
          .map((subcat) => subcat.id);
        newData.subCategoryIds = prev.subCategoryIds.filter((id) =>
          validSubCategoryIds.includes(id)
        );
      }

      return newData;
    });
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

  const handleCategoryCreated = (newCategory: { id: string; name: string }) => {
    // Add the new category to the list
    setCategories((prev) => [
      ...prev,
      {
        id: newCategory.id,
        name: newCategory.name,
        description: null,
        subCategories: [],
      },
    ]);
    showToast("Category created!", "success");
  };

  return (
    <VendorPageLayout
      pageTitle="Add New Product"
      backgroundImage="/hero-bg.jpg"
      vendorName={business.name}
      vendorLogo={business.logo || "/placeholder-logo.svg"}
      activeTab="Inventory"
      sectionTitle="Create New Product"
    >
      <div className="card bg-base-100 shadow-sm border border-gray-300">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image Section */}
            <div className="w-full lg:w-1/3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="flex flex-col items-center">
                  <Image
                    src={imageUrl}
                    alt="Product preview"
                    width={300}
                    height={300}
                    className="rounded-lg object-cover w-full max-w-sm h-64 border border-gray-200"
                  />
                  <div className="mt-4 w-full">
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      className="input input-bordered w-full"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        handleInputChange("imageUrl", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="w-full lg:w-2/3 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Basic Information
                </h3>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter product description"
                    className="textarea textarea-bordered w-full h-24"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="input input-bordered w-full"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="input input-bordered w-full"
                      value={formData.stock}
                      onChange={(e) =>
                        handleInputChange("stock", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Product Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Status *
                  </label>
                  <select
                    className="select select-bordered w-full md:w-1/2"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        e.target.value as ProductStatus
                      )
                    }
                    required
                  >
                    <option value={ProductStatus.VISIBLE}>Visible</option>
                    <option value={ProductStatus.HIDDEN}>Hidden</option>
                    <option value={ProductStatus.ARCHIVED}>Archived</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Visible products are shown to customers, Hidden products are
                    not displayed, and Archived products are permanently removed
                    from listings.
                  </p>
                </div>
              </div>

              {/* Brand Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Brand Information
                </h3>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={formData.brandId}
                      onChange={(e) =>
                        handleInputChange("brandId", e.target.value)
                      }
                      required
                    >
                      <option value="">Select a brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowBrandForm(true)}
                  >
                    <FaPlus className="text-xs" />
                    Add Brand
                  </button>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Categories
                  </h3>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowCategoryForm(true)}
                  >
                    <FaPlus className="text-xs" />
                    Add Category
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={formData.categoryIds.includes(category.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentIds = formData.categoryIds;
                            const newIds = isChecked
                              ? [...currentIds, category.id]
                              : currentIds.filter((id) => id !== category.id);
                            handleInputChange("categoryIds", newIds);
                          }}
                        />
                        <span className="text-sm text-gray-700">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                {filteredSubCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategories
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                      {filteredSubCategories.map((subCategory) => (
                        <label
                          key={subCategory.id}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={formData.subCategoryIds.includes(
                              subCategory.id
                            )}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const currentIds = formData.subCategoryIds;
                              const newIds = isChecked
                                ? [...currentIds, subCategory.id]
                                : currentIds.filter(
                                    (id) => id !== subCategory.id
                                  );
                              handleInputChange("subCategoryIds", newIds);
                            }}
                          />
                          <span className="text-sm text-gray-700">
                            {subCategory.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  className="btn btn-success flex-1"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <FaSave className="text-sm mr-2" />
                  {isLoading ? "Creating..." : "Create Product"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline flex-1"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <FaTimes className="text-sm mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Form Modal */}
      {showBrandForm && (
        <BrandForm
          isOpen={showBrandForm}
          onClose={() => setShowBrandForm(false)}
          onBrandCreated={handleBrandCreated}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          isOpen={showCategoryForm}
          onClose={() => setShowCategoryForm(false)}
          onCategoryCreated={handleCategoryCreated}
        />
      )}

      {/* Toast Component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </VendorPageLayout>
  );
}
