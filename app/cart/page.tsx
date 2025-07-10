'use client';

import { useEffect, useState } from 'react';
import { FaShoppingCart, FaTrash, FaCreditCard } from 'react-icons/fa';
import MiniHero from '@/lib/ui/dashboard/MiniHero';
import Link from 'next/link';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    inStock?: boolean;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      console.log('Token in localStorage:', token);
  
      if (!token) {
        console.warn('No token found. User may not be logged in.');
        return;
      }
  
      const res = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      console.log('Cart API response:', data);
  
      if (res.ok) {
        setCartItems(data);
      } else {
        console.error(data.error);
      }
  
      setLoading(false);
    };
  
    fetchCart();
  }, []);
  

  const handleQuantityChange = async (id: string, delta: number) => {
    const newQuantity = Math.max(1, cartItems.find(item => item.id === id)?.quantity! + delta);
  
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  
    const token = localStorage.getItem('token');
    if (!token) return;
  
    await fetch(`/api/cart/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });
  };
  
  const handleRemoveItem = async (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  
    const token = localStorage.getItem('token');
    if (!token) return;
  
    await fetch(`/api/cart/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to proceed to checkout.');
      router.push('/login');
      return;
    }
  
    // User is logged in — continue to checkout page
    router.push('/checkout');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#ffefaf6]">
      <MiniHero
        title="Your Shopping Cart"
        backgroundImage="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=400&fit=crop"
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaShoppingCart /> {cartItems.length} Item(s) in Cart
            </h2>

            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : cartItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500 bg-white border rounded">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg shadow-sm p-4 border"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      {item.product.inStock === false && (
                        <span className="badge badge-warning mt-1">Out of Stock</span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 sm:mt-0">
                      <div className="text-sm text-gray-600">
                        <div>
                          Price: <strong>${item.product.price.toFixed(2)}</strong>
                        </div>
                        <div>
                          Total:{' '}
                          <strong>
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      <div className="flex items-center border rounded overflow-hidden">
                        <button
                          className="btn btn-sm px-3"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </button>
                        <div className="px-3 text-sm">{item.quantity}</div>
                        <button
                          className="btn btn-sm px-3"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="card bg-base-100 shadow-sm border sticky top-8">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="divider"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                <button onClick={handleCheckout} className="btn btn-primary w-full">
  <FaCreditCard className="mr-2" />
  Proceed to Checkout
</button>

                  <div className="flex justify-center">
                    <Link href="/" className="btn btn-outline">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
