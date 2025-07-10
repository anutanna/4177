"use client";

import { useCart } from '@/lib/ui/context/CartContext'; // 👈 adjust the path if needed
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from 'next/link';


interface ProductProps {
  name: string;
  price: string;
  image: string;
  id: string;
}

export default function ProductCard({ name, price, image, id }: ProductProps) {
  const { fetchCartItems } = useCart(); // 👈 update cart context after adding
  const router = useRouter();

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      if (res.ok) {
        await fetchCartItems(); // 👈 update cart count in header
        alert("Item added to cart!");
      } else {
        const errorData = await res.json();
        alert("Failed to add to cart: " + errorData.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="card w-full max-w-xs bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <figure className="px-4 pt-4">
        <img
          src={image}
          alt={name}
          className="rounded-xl h-40 object-cover w-full"
        />
      </figure>
      <div className="card-body items-center text-center px-4 pb-4">
        <h2 className="card-title text-base font-semibold">{name}</h2>
        <p className="text-sm text-gray-700">Price: ${price}</p>
        <button
  onClick={handleAddToCart}
  className="btn btn-primary btn-sm"
  aria-label={`Add ${name} to cart`}
>
  Add to Cart
</button>
<Link href={`/products/${id}`} aria-label={`View details for ${name}`}>
  <button className="btn btn-outline btn-sm">
    View Details
  </button>
</Link>


      </div>
    </div>
  );
}
