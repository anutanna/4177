"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import {
  createCategory,
  createSubCategory,
  getCategories,
} from "@/lib/actions/db_category_actions";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: { id: string; name: string }) => void;
  onSubCategoryCreated?: (subCategory: {
    id: string;
    name: string;
    categoryId: string;
  }) => void;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function CategoryForm({
  isOpen,
  onClose,
  onCategoryCreated,
  onSubCategoryCreated,
}: CategoryFormProps) {
  const [formType, setFormType] = useState<"category" | "subcategory">(
    "category"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "", // For subcategory
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Load categories when form opens for subcategory creation
  useEffect(() => {
    if (isOpen && formType === "subcategory") {
      loadCategories();
    }
  }, [isOpen, formType]);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      setToast({
        message: "Failed to load categories",
        type: "error",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setToast({
        message: `${
          formType === "category" ? "Category" : "Subcategory"
        } name is required`,
        type: "error",
      });
      return;
    }

    if (formType === "subcategory" && !formData.categoryId) {
      setToast({ message: "Please select a category", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      if (formType === "category") {
        const newCategory = await createCategory(
          formData.name.trim(),
          formData.description.trim() || undefined
        );

        onCategoryCreated({
          id: newCategory.id,
          name: newCategory.name,
        });
        setToast({
          message: "Category created successfully!",
          type: "success",
        });
      } else {
        const newSubCategory = await createSubCategory(
          formData.name.trim(),
          formData.categoryId,
          formData.description.trim() || undefined
        );

        if (onSubCategoryCreated) {
          onSubCategoryCreated({
            id: newSubCategory.id,
            name: newSubCategory.name,
            categoryId: newSubCategory.categoryId,
          });
        }
        setToast({
          message: "Subcategory created successfully!",
          type: "success",
        });
      }

      // Reset form and close modal after a brief delay
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error(`Error creating ${formType}:`, error);
      setToast({
        message: `Failed to create ${formType}. Please try again.`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: "",
    });
    setFormType("category");
    setToast(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Modal header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Create New {formType === "category" ? "Category" : "Subcategory"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <FaTimes />
            </button>
          </div>

          {/* Form type selector */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormType("category")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  formType === "category"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                disabled={isLoading}
              >
                Category
              </button>
              <button
                type="button"
                onClick={() => setFormType("subcategory")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  formType === "subcategory"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                disabled={isLoading}
              >
                Subcategory
              </button>
            </div>
          </div>

          {/* Modal body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Category selection for subcategory */}
              {formType === "subcategory" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      handleInputChange("categoryId", e.target.value)
                    }
                    className="input input-bordered w-full"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formType === "category" ? "Category" : "Subcategory"} Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={`Enter ${
                    formType === "category" ? "category" : "subcategory"
                  } name`}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="textarea textarea-bordered w-full"
                  placeholder={`Enter ${
                    formType === "category" ? "category" : "subcategory"
                  } description (optional)`}
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="btn btn-primary flex-1 gap-2"
                disabled={isLoading}
              >
                <FaSave className="text-sm" />
                {isLoading
                  ? "Creating..."
                  : `Create ${
                      formType === "category" ? "Category" : "Subcategory"
                    }`}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost gap-2"
                disabled={isLoading}
              >
                <FaTimes className="text-sm" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60]">
          <div
            className={`alert ${
              toast.type === "success"
                ? "alert-success"
                : toast.type === "error"
                ? "alert-error"
                : toast.type === "warning"
                ? "alert-warning"
                : "alert-info"
            } shadow-lg`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="btn btn-circle btn-xs btn-ghost ml-2"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
