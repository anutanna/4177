'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { Input } from '@/lib/ui/components/input';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const userRole = localStorage.getItem('role');
    setLoggedIn(!!token);
    setUserName(name);
    setRole(userRole);
  }, []);

  const handleAccountClick = () => {
    if (loggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('role');
      setLoggedIn(false);
      router.replace('/');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="Shopizon" />
      </div>

      <div className={styles.searchWrapper}>
        <Input type="text" placeholder="Search" className={styles.searchInput} />
        <button className={styles.searchBtn}>
          <span>🔍</span>
        </button>
      </div>

      <div className={styles.icons}>
        <Link href="/">
          <span className={styles.icon}>🏠</span>
        </Link>

        {loggedIn && role === 'vendor' && (
          <Link href="/vendor/dashboard">
            <span className={styles.icon}>📦 Vendor</span>
          </Link>
        )}

        <span className={styles.icon} onClick={handleAccountClick}>
          {loggedIn ? '🚪 Logout' : '👤 Login'}
        </span>

        <Link href="/cart">
          <span className={styles.icon}>
            🛍️ <span className={styles.cartCount}>0</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
