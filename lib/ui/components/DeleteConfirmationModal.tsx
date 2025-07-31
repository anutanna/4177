"use client";

import { useState } from "react";
import { FaTimes, FaTrash, FaExclamationTriangle } from "react-icons/fa";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Modal header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-circle btn-sm btn-ghost"
              disabled={isDeleting || isLoading}
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          {/* Modal body */}
          <div className="p-6">
            <p className="text-gray-700 mb-4">{message}</p>
            {itemName && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-medium text-gray-900">Item to delete:</p>
                <p className="text-gray-700 mt-1">&ldquo;{itemName}&rdquo;</p>
              </div>
            )}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ This action cannot be undone
              </p>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting || isLoading}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting || isLoading}
              className="btn btn-error flex-1 gap-2"
            >
              <FaTrash className="text-sm" />
              {isDeleting || isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
