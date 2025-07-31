"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import VendorPageLayout from "@/lib/ui/dashboard/VendorPageLayout";
import Toast from "@/lib/ui/components/Toast";
import BrandForm from "@/lib/ui/components/BrandForm";
import CategoryForm from "@/lib/ui/components/CategoryForm";
import {
  updateProductWithCategories,
  deleteProduct,
} from "@/lib/actions/db_product_actions";
import { getBrands } from "@/lib/actions/db_brand_actions";
import { getCategories } from "@/lib/actions/db_category_actions";
import { useRouter } from "next/navigation";
import { ProductStatus } from "@prisma/client";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    status: ProductStatus;
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
    categories: {
      category: {
        id: string;
        name: string;
        description: string | null;
      };
    }[];
    subCategories: {
      subCategory: {
        id: string;
        name: string;
        description: string | null;
        categoryId: string;
      };
    }[];
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

export default function VendorProductDetails({
  product,
  business,
}: ProductDetailsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);

  // Form state
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    price: product.price.toString(),
    stock: product.stock.toString(),
    status: product.status,
    brandId: product.brand.id,
    categoryIds: product.categories.map((pc) => pc.category.id),
    subCategoryIds:
      product.subCategories?.map((psc) => psc.subCategory.id) || [],
    imageUrl: product.images[0]?.url || "",
  });

  const imageUrl = isEditing
    ? formData.imageUrl || "/no-image.svg"
    : product.images[0]?.url || "/no-image.svg";

  // Load brands and categories on component mount and when editing starts
  const loadBrandsAndCategories = useCallback(async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        getBrands(),
        getCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);

      // Filter subcategories based on selected categories
      updateFilteredSubCategories(formData.categoryIds, categoriesData);
    } catch (error) {
      console.error("Error loading brands and categories:", error);
      showToast("Failed to load brands and categories", "error");
    }
  }, [formData.categoryIds]);

  useEffect(() => {
    if (isEditing) {
      loadBrandsAndCategories();
    }
  }, [isEditing, loadBrandsAndCategories]);

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
      status: product.status,
      brandId: product.brand.id,
      categoryIds: product.categories.map((pc) => pc.category.id),
      subCategoryIds:
        product.subCategories?.map((psc) => psc.subCategory.id) || [],
      imageUrl: product.images[0]?.url || "",
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProductWithCategories(
        product.id,
        formData.name,
        formData.description || null,
        parseFloat(formData.price),
        parseInt(formData.stock),
        formData.brandId,
        formData.categoryIds,
        formData.subCategoryIds,
        formData.imageUrl,
        formData.status
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

      // Redirect to inventory page after a short delay
      setTimeout(() => {
        router.push("/inventory");
      }, 1500);
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("Failed to delete product. Please try again.", "error");
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
    // Add the new category to the list and select it
    setCategories((prev) => [
      ...prev,
      {
        id: newCategory.id,
        name: newCategory.name,
        description: null,
        subCategories: [],
      },
    ]);
    setFormData((prev) => ({
      ...prev,
      categoryIds: [...prev.categoryIds, newCategory.id],
    }));
    showToast("Category created and selected!", "success");
  };

  const handleSubCategoryCreated = (newSubCategory: {
    id: string;
    name: string;
    categoryId: string;
  }) => {
    // Add the new subcategory to the filtered list and select it
    const newSubCat: SubCategory = {
      id: newSubCategory.id,
      name: newSubCategory.name,
      description: null,
      categoryId: newSubCategory.categoryId,
    };

    setFilteredSubCategories((prev) => [...prev, newSubCat]);
    setFormData((prev) => ({
      ...prev,
      subCategoryIds: [...prev.subCategoryIds, newSubCategory.id],
    }));
    showToast("Subcategory created and selected!", "success");
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleSubCategoryToggle = (subCategoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      subCategoryIds: prev.subCategoryIds.includes(subCategoryId)
        ? prev.subCategoryIds.filter((id) => id !== subCategoryId)
        : [...prev.subCategoryIds, subCategoryId],
    }));
  };

  return (
    <>
      <VendorPageLayout
        pageTitle="Product Details"
        backgroundImage="/hero-bg.jpg"
        vendorName={business.name}
        vendorLogo={business.logo || "/placeholder-logo.svg"}
        activeTab="Inventory"
        sectionTitle={isEditing ? "Edit Product" : "Product Information"}
        actionButton={
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  className="btn gap-2"
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
                  {isLoading ? "Saving..." : "Save"}
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
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="rounded-lg object-cover w-full max-h-[500px]"
                    />
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

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Description
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
                        disabled={!isEditing}
                        className="input input-bordered w-full"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Price and Stock - Two columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-base-content mb-2">
                          Price ($)
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

                      {/* Stock */}
                      <div>
                        <label className="block text-sm font-medium text-base-content mb-2">
                          Stock Quantity
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
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Status
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange(
                              "status",
                              e.target.value as ProductStatus
                            )
                          }
                          className="select select-bordered w-full"
                        >
                          <option value={ProductStatus.VISIBLE}>Visible</option>
                          <option value={ProductStatus.HIDDEN}>Hidden</option>
                          <option value={ProductStatus.ARCHIVED}>
                            Archived
                          </option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={
                            product.status.charAt(0).toUpperCase() +
                            product.status.slice(1).toLowerCase()
                          }
                          disabled
                          className="input input-bordered w-full bg-base-200"
                        />
                      )}
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Brand
                      </label>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <select
                              value={formData.brandId}
                              onChange={(e) =>
                                handleInputChange("brandId", e.target.value)
                              }
                              className="select select-bordered flex-1"
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
                            >
                              <FaPlus className="text-sm" />
                              New Brand
                            </button>
                          </>
                        ) : (
                          <input
                            type="text"
                            value={product.brand.name}
                            disabled
                            className="input input-bordered w-full bg-base-200"
                          />
                        )}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-base-content">
                          Categories
                        </label>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => setShowCategoryForm(true)}
                            className="btn btn-outline btn-secondary btn-sm gap-2"
                          >
                            <FaPlus className="text-xs" />
                            New Category
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-base-50">
                          {categories.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                              No categories available
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {categories.map((category) => (
                                <label
                                  key={category.id}
                                  className="flex items-start gap-3 p-2 hover:bg-base-100 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.categoryIds.includes(
                                      category.id
                                    )}
                                    onChange={() =>
                                      handleCategoryToggle(category.id)
                                    }
                                    className="checkbox checkbox-primary mt-1 flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">
                                      {category.name}
                                    </div>
                                    {category.description && (
                                      <div className="text-xs text-gray-500 line-clamp-2">
                                        {category.description}
                                      </div>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {product.categories.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                              No categories assigned
                            </p>
                          ) : (
                            product.categories.map((pc) => (
                              <div
                                key={pc.category.id}
                                className="badge badge-outline badge-lg gap-2 p-3"
                              >
                                <span className="font-medium">
                                  {pc.category.name}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Subcategories */}
                    {formData.categoryIds.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-base-content">
                            Subcategories
                          </label>
                        </div>

                        {isEditing ? (
                          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-base-50">
                            {filteredSubCategories.length === 0 ? (
                              <p className="text-gray-500 text-sm">
                                No subcategories available for selected
                                categories
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {filteredSubCategories.map((subCategory) => (
                                  <label
                                    key={subCategory.id}
                                    className="flex items-start gap-3 p-2 hover:bg-base-100 rounded cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.subCategoryIds.includes(
                                        subCategory.id
                                      )}
                                      onChange={() =>
                                        handleSubCategoryToggle(subCategory.id)
                                      }
                                      className="checkbox checkbox-secondary mt-1 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm">
                                        {subCategory.name}
                                      </div>
                                      {subCategory.description && (
                                        <div className="text-xs text-gray-500 line-clamp-2">
                                          {subCategory.description}
                                        </div>
                                      )}
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {product.subCategories?.length === 0 ? (
                              <p className="text-gray-500 text-sm">
                                No subcategories assigned
                              </p>
                            ) : (
                              product.subCategories?.map((psc) => (
                                <div
                                  key={psc.subCategory.id}
                                  className="badge badge-outline badge-secondary badge-lg gap-2 p-3"
                                >
                                  <span className="font-medium">
                                    {psc.subCategory.name}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Business (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Business
                      </label>
                      <input
                        type="text"
                        value={product.business.name}
                        disabled
                        className="input input-bordered w-full bg-base-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VendorPageLayout>

      {/* Brand Form Modal */}
      <BrandForm
        isOpen={showBrandForm}
        onClose={() => setShowBrandForm(false)}
        onBrandCreated={handleBrandCreated}
      />

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
        onCategoryCreated={handleCategoryCreated}
        onSubCategoryCreated={handleSubCategoryCreated}
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
