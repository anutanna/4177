"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaCreditCard, FaArrowLeft } from "react-icons/fa";
import { createOrderFromCart } from "@/lib/actions/checkout_actions";
import { useCart } from "@/lib/ui/context/CartContext";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    description?: string | null;
    business: {
      id: string;
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

interface CheckoutContentProps {
  cartItems: CartItem[];
}

export default function CheckoutContent({ cartItems }: CheckoutContentProps) {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const router = useRouter();
  const { fetchCartItems } = useCart();

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Group items by business for display
  const itemsByBusiness = cartItems.reduce((acc, item) => {
    const businessId = item.product.business.id;
    const businessName = item.product.business.name;
    
    if (!acc[businessId]) {
      acc[businessId] = {
        businessName,
        items: [],
        businessSubtotal: 0,
      };
    }
    
    acc[businessId].items.push(item);
    acc[businessId].businessSubtotal += item.product.price * item.quantity;
    
    return acc;
  }, {} as Record<string, { businessName: string; items: CartItem[]; businessSubtotal: number }>);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    try {
      const result = await createOrderFromCart();
      
      if (result.success) {
        // Refresh cart count in header
        await fetchCartItems();
        // Redirect to order confirmation page
        router.push("/order-confirmation?success=true");
      } else {
        alert("Failed to place order: " + result.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong while placing your order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/cart"
          className="btn btn-circle btn-outline btn-sm"
          title="Back to Cart"
        >
          <FaArrowLeft size={14} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaShoppingCart className="text-blue-600" />
          Checkout
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            {Object.entries(itemsByBusiness).map(([businessId, businessData]) => (
              <div key={businessId} className="mb-8 last:mb-0">
                <div className="border-b pb-3 mb-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {businessData.businessName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Subtotal: ${businessData.businessSubtotal.toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {businessData.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.images[0].altText || item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.brand.name}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${item.product.price.toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  defaultValue="John Doe"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  defaultValue="john@example.com"
                  disabled
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  defaultValue="123 Main Street"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  defaultValue="Halifax"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  defaultValue="B3H 4R2"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  defaultValue="•••• •••• •••• 1234"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  defaultValue="12/26"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  defaultValue="•••"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Total & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border sticky top-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Order Total</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-xl text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-gradient-to-r from-[#21C1B9] to-[#1A71D5] text-white font-medium py-4 px-6 rounded-lg hover:from-[#1DB1A9] hover:to-[#1565C0] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  <FaCreditCard />
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </button>

                <Link
                  href="/cart"
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center justify-center border border-gray-300"
                >
                  Back to Cart
                </Link>

                <Link
                  href="/"
                  className="w-full text-center text-blue-600 hover:text-blue-800 text-sm py-2"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
