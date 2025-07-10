'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  productId: string;
}

export default function AddToCartSection({ productId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      // User not logged in — store in localStorage
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = localCart.find((item: any) => item.productId === productId);
  
      if (existing) {
        existing.quantity += 1;
      } else {
        localCart.push({ productId, quantity: 1 });
      }
  
      localStorage.setItem('cart', JSON.stringify(localCart));
      alert('Item added to cart!');
      return;
    }
  
    // User is logged in — call API
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        alert('Item added to cart!');
      })
      .catch(err => alert(err.message));
  };
  

  return (
    <button
      className="btn btn-primary w-full max-w-xs"
      onClick={handleAddToCart}
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
