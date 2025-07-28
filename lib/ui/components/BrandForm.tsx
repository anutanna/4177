"use client";

import { useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import { createBrand } from "@/lib/actions/db_brand_actions";

interface BrandFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBrandCreated: (brand: { id: string; name: string }) => void;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function BrandForm({
  isOpen,
  onClose,
  onBrandCreated,
}: BrandFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setToast({ message: "Brand name is required", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const newBrand = await createBrand(
        formData.name.trim(),
        formData.description.trim() || undefined,
        formData.logo.trim() || undefined,
        formData.website.trim() || undefined
      );

      onBrandCreated({ id: newBrand.id, name: newBrand.name });
      setToast({ message: "Brand created successfully!", type: "success" });

      // Reset form and close modal after a brief delay
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error("Error creating brand:", error);
      setToast({
        message: "Failed to create brand. Please try again.",
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
      logo: "",
      website: "",
    });
    setToast(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Modal header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Create New Brand
            </h2>
            <button
              onClick={handleClose}
              className="btn btn-circle btn-sm btn-ghost"
              disabled={isLoading}
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          {/* Modal body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isLoading}
                className="input input-bordered w-full"
                placeholder="Enter brand name"
                required
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
                disabled={isLoading}
                className="textarea textarea-bordered w-full h-24 resize-none"
                placeholder="Enter brand description (optional)"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => handleInputChange("logo", e.target.value)}
                disabled={isLoading}
                className="input input-bordered w-full"
                placeholder="https://example.com/logo.png (optional)"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                disabled={isLoading}
                className="input input-bordered w-full"
                placeholder="https://example.com (optional)"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-1 gap-2"
              >
                <FaSave className="text-sm" />
                {isLoading ? "Creating..." : "Create Brand"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="btn btn-ghost flex-1"
              >
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
