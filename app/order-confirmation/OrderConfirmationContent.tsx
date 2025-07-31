"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaCheckCircle,
  FaShoppingBag,
  FaHome,
  FaReceipt,
} from "react-icons/fa";

export default function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      setIsSuccess(true);
    } else {
      // If not coming from successful checkout, redirect to home
      router.push("/");
    }
  }, [searchParams, router]);

  if (!isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
          <FaCheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-gray-600">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FaReceipt className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Order Confirmation
          </h2>
        </div>

        <div className="space-y-4 text-left">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium text-gray-900">
              #{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Status:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Processing
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Estimated Delivery:</span>
            <span className="font-medium text-gray-900">
              {new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          What&apos;s Next?
        </h3>
        <div className="text-left space-y-2 text-blue-800">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            We&apos;re preparing your order for shipment
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            You&apos;ll receive an email confirmation shortly
          </p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            We&apos;ll send tracking information once your order ships
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#21C1B9] to-[#1A71D5] text-white font-medium py-3 px-6 rounded-lg hover:from-[#1DB1A9] hover:to-[#1565C0] transition-all duration-200"
          >
            <FaHome size={16} />
            Continue Shopping
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border border-gray-300"
          >
            <FaShoppingBag size={16} />
            View My Orders
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          Need help? Contact our{" "}
          <a
            href="mailto:support@shopizon.com"
            className="text-blue-600 hover:text-blue-800"
          >
            customer support team
          </a>
        </p>
      </div>

      {/* Order Summary Animation */}
      <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
        <div className="animate-pulse">
          <p className="text-green-700 font-medium">
            🎉 Your order is being processed with care!
          </p>
        </div>
      </div>
    </div>
  );
}
