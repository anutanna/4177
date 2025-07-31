"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaSpinner } from "react-icons/fa";
import { authClient } from "@/auth-client";
import { addToCart } from "@/lib/actions/cart_actions";
import { useCart } from "@/lib/ui/context/CartContext";
import Toast from "@/lib/ui/components/Toast";

interface Props {
  productId: string;
  stock?: number;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function AddToCartSection({ productId, stock }: Props) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<ToastState | null>(null);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { fetchCartItems } = useCart();

  const handleAddToCart = async () => {
    if (!session?.user) {
      // User not logged in - redirect to login
      setToast({
        message: "Please log in to add items to cart.",
        type: "info",
      });
      router.push("/login");
      return;
    }

    // User is logged in — use server action
    setLoading(true);
    try {
      const result = await addToCart(productId, quantity);

      if (result.success) {
        await fetchCartItems(); // Update cart count in header
        setToast({
          message: `${quantity} item(s) added to cart!`,
          type: "success",
        });
      } else {
        setToast({
          message: "Failed to add to cart: " + result.error,
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        message: "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stock Information */}
      {stock !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Stock:</span>
          <span
            className={`text-sm font-semibold ${
              stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            disabled={quantity <= 1 || (stock !== undefined && stock <= 0)}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-0 appearance-none"
            style={{
              MozAppearance: "textfield", // Firefox
              WebkitAppearance: "none", // Chrome, Safari, Edge
              appearance: "none", // Standard
            }}
            disabled={stock !== undefined && stock <= 0}
          />
          <button
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            disabled={quantity >= 99 || (stock !== undefined && stock <= 0)}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading || (stock !== undefined && stock <= 0)}
        className="btn w-full h-12 text-white shadow-lg text-lg font-semibold border-none hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
        style={{
          background: loading
            ? "linear-gradient(to right, #9CA3AF, #6B7280)"
            : stock !== undefined && stock <= 0
            ? "linear-gradient(to right, #9CA3AF, #6B7280)"
            : "linear-gradient(to right, #21C1B9, #1A71D5)",
        }}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin text-lg" />
            Adding...
          </>
        ) : stock !== undefined && stock <= 0 ? (
          "Out of Stock"
        ) : (
          <>
            <FaShoppingCart className="text-lg" />
            Add to Cart
          </>
        )}
      </button>

      {/* Toast Component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
