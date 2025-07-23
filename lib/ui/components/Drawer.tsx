"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  cartCount: number;
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  cartCount,
}: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Menu</h2>
            <div className="flex items-center gap-4">
              {/* Cart icon */}
              <div className="flex items-center gap-2">
                <FaShoppingCart className="text-lg" />
                <span className="text-sm font-bold">{cartCount}</span>
              </div>
              {/* Close button */}
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{children}</div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              &copy; Shopify 2025.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
