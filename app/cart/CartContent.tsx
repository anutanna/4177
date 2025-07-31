"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaTrash,
  FaCreditCard,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import {
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/actions/cart_actions";
import Toast from "@/lib/ui/components/Toast";

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    inStock?: boolean;
    description?: string | null;
    business: {
      name: string;
    };
    brand: {
      name: string;
    };
    images: Array<{
      id: string;
      url: string;
      altText?: string | null;
    }>;
  };
}

interface CartContentProps {
  initialCartItems: CartItem[];
}

export default function CartContent({ initialCartItems }: CartContentProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState | null>(null);
  const router = useRouter();

  const handleQuantityChange = async (id: string, delta: number) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + delta);

    // Optimistically update the UI
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    startTransition(async () => {
      const result = await updateCartItemQuantity(id, newQuantity);

      if (!result.success) {
        // Revert the optimistic update if the action failed
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: currentItem.quantity } : item
          )
        );
        setToast({
          message: "Failed to update quantity: " + result.error,
          type: "error",
        });
        console.error("Error updating cart item:", result.error);
      }
    });
  };

  const handleRemoveItem = async (id: string) => {
    // Optimistically remove the item
    const itemToRemove = cartItems.find((item) => item.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    startTransition(async () => {
      const result = await removeCartItem(id);

      if (!result.success) {
        // Revert the optimistic update if the action failed
        if (itemToRemove) {
          setCartItems((prev) => [...prev, itemToRemove]);
        }
        setToast({
          message: "Failed to remove item: " + result.error,
          type: "error",
        });
        console.error("Error removing cart item:", result.error);
      } else {
        setToast({
          message: "Item removed from cart",
          type: "success",
        });
      }
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaShoppingCart /> {cartItems.length} Item(s) in Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white border rounded">
            Your cart is empty.
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Product Image - Rounded Square */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shadow-sm">
                        {item.product.images &&
                        item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={
                              item.product.images[0].altText ||
                              item.product.name
                            }
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details and Controls */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        {/* Product Info */}
                        <div className="flex-grow pr-4">
                          <h3 className="font-bold text-xl text-gray-900 mb-2">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Seller:</span>{" "}
                            {item.product.business.name}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Brand:</span>{" "}
                            {item.product.brand.name}
                          </p>
                          {item.product.inStock === false && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 flex-shrink-0 disabled:opacity-50"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isPending}
                          title="Remove from cart"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>

                      {/* Price and Quantity Row */}
                      <div className="flex items-center justify-between">
                        {/* Price Information */}
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                              Unit Price
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              ${item.product.price.toFixed(2)}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                              Quantity
                            </p>
                            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                              <button
                                className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                                disabled={item.quantity <= 1 || isPending}
                              >
                                <FaMinus size={14} />
                              </button>
                              <div className="px-6 py-2 font-bold text-gray-900 border-x border-gray-300">
                                {item.quantity}
                              </div>
                              <button
                                className="px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                disabled={isPending}
                              >
                                <FaPlus size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                              Line Total
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-lg shadow-sm border sticky top-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isPending}
                className="w-full bg-gradient-to-r from-[#21C1B9] to-[#1A71D5] text-white font-medium py-3 px-4 rounded-lg hover:from-[#1DB1A9] hover:to-[#1565C0] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCreditCard />
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center justify-center border border-gray-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

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
