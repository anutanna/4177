"use client";

import { useCart } from "@/lib/ui/context/CartContext"; // 👈 adjust the path if needed
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaTag } from "react-icons/fa";
import { authClient } from "@/auth-client";
import { addToCart } from "@/lib/actions/cart_actions";

interface ProductProps {
  name: string;
  price: string;
  image: string;
  id: string;
}

export default function ProductCard({ name, price, image, id }: ProductProps) {
  const { fetchCartItems } = useCart(); // 👈 update cart context after adding
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleAddToCart = async () => {
    if (!session?.user) {
      alert("Please log in first.");
      router.push("/login");
      return;
    }

    try {
      const result = await addToCart(id, 1);

      if (result.success) {
        await fetchCartItems(); // 👈 update cart count in header
        alert("Item added to cart!");
      } else {
        alert("Failed to add to cart: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="card w-full max-w-xs bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${id}`} aria-label={`View details for ${name}`}>
        <figure className="px-4 pt-4">
          <Image
            src={image}
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
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={handleAddToCart}
            className="btn flex-1 h-10 text-white shadow-sm text-base font-semibold border-none"
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
          >
            <button
              className="btn w-10 h-10 flex items-center justify-center p-0 shadow-sm bg-gray-100 hover:bg-gray-200"
              style={{ border: "none" }}
              aria-label={`View details for ${name}`}
            >
              <FaEye className="text-gray-600" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
