"use client";

import { useCart } from "@/lib/ui/context/CartContext"; // 👈 adjust the path if needed
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaTag } from "react-icons/fa";
import { authClient } from "@/auth-client";
import { addToCart } from "@/lib/actions/cart_actions";
import { useState } from "react";
import Toast from "@/lib/ui/components/Toast";

interface ProductProps {
  name: string;
  price: number;
  image?: string;
  id: string;
}

interface ProductProps {
  name: string;
  price: number;
  image?: string;
  id: string;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function ProductCard({ name, price, image, id }: ProductProps) {
  const { fetchCartItems } = useCart(); // 👈 update cart context after adding
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleAddToCart = async () => {
    if (!session?.user) {
      setToast({
        message: "Please log in first.",
        type: "info",
      });
      router.push("/login");
      return;
    }

    try {
      const result = await addToCart(id, 1);

      if (result.success) {
        await fetchCartItems(); // 👈 update cart count in header
        setToast({
          message: "Item added to cart!",
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
    }
  };

  return (
    <div className="card w-full max-w-xs bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${id}`} aria-label={`View details for ${name}`}>
        <figure className="px-4 pt-4">
          <Image
            src={image || "/no-image.svg"}
            alt={name}
            className="rounded-xl h-40 object-cover w-full"
            width={400}
            height={400}
          />
        </figure>
      </Link>
      <div className="card-body items-center text-center pb-4 p-4">
        <h2
          className="card-title text-base font-semibold h-12 flex items-center justify-center text-center overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </h2>
        <p className="w-full text-center mt-2 mb-4 text-xl font-bold flex items-center justify-center gap-1">
          <span>${Number(price).toFixed(2)}</span>
          <FaTag className="text-red-800 ml-2" />
        </p>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleAddToCart}
            className="btn w-full h-10 text-white shadow-sm text-base font-semibold border-none hover:shadow-lg transition-all duration-300"
            style={{
              background: "linear-gradient(to right, #21C1B9, #1A71D5)",
            }}
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </button>
          <Link
            href={`/products/${id}`}
            aria-label={`View details for ${name}`}
            className="w-full"
          >
            <button
              className="btn w-full h-8 text-sm bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border-gray-300"
              aria-label={`View details for ${name}`}
            >
              <FaEye className="text-gray-600 mr-1" />
              View Details
            </button>
          </Link>
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
