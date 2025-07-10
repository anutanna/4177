'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { Input } from '@/lib/ui/components/input';
import { useCart } from '@/lib/ui/context/CartContext';

interface Product {
  id: string;
  name: string;
}

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { cartCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const userRole = localStorage.getItem('role');
    setLoggedIn(!!token);
    setUserName(name);
    setRole(userRole);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    setShowDropdown(true);

    if (!query) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/products`);
      const data: Product[] = await res.json();
      const filtered = data.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    }
  };

  const handleSelect = (id: string) => {
    router.push(`/products/${id}`);
    setSearch('');
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
      setShowDropdown(false);
    }
  };

  const handleAccountClick = () => {
    localStorage.clear();
    setLoggedIn(false);
    router.replace('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="Shopizon" />
      </div>

      <form className={styles.searchWrapper} onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          value={search}
          onChange={handleSearch}
          onFocus={() => search && setShowDropdown(true)}
        />
        {showDropdown && (
          <div className={styles.searchResults}>
            {results.length === 0 ? (
              <div className={styles.searchResultItem}>No results found</div>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  className={styles.searchResultItem}
                  onClick={() => handleSelect(product.id)}
                >
                  {product.name}
                </div>
              ))
            )}
          </div>
        )}
      </form>

      {loggedIn && userName && (
        <span className={styles.userName}>👋 Hi, {userName}</span>
      )}

      <div className={styles.icons}>
        <Link href="/"><span className={styles.icon}>🏠</span></Link>
        {loggedIn && role === 'VENDOR' && (
          <Link href="/dashboard"><span className={styles.icon}>📦 Vendor</span></Link>
        )}
        <span className={styles.icon} onClick={handleAccountClick}>
          {loggedIn ? '🚪 Logout' : '👤 Login'}
        </span>
        <Link href="/cart">
          <span className={styles.icon}>
            🛍️ <span className={styles.cartCount}>{cartCount}</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
