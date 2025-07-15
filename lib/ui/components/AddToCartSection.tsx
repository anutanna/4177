"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";
import { addToCart } from "@/lib/actions/cart_actions";

interface Props {
  productId: string;
}

export default function AddToCartSection({ productId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleAddToCart = async () => {
    if (!session?.user) {
      // User not logged in - redirect to login
      alert("Please log in to add items to cart.");
      router.push("/login");
      return;
    }

    // User is logged in — use server action
    setLoading(true);
    try {
      const result = await addToCart(productId, 1);

      if (result.success) {
        alert("Item added to cart!");
      } else {
        alert("Failed to add to cart: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary w-full max-w-xs"
      onClick={handleAddToCart}
      disabled={loading}
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
