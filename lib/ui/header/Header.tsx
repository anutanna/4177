'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/lib/ui/components/input';
import styles from './Header.module.css';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    setLoggedIn(!!token);
    setUserName(name);
  }, []);

  const handleAccountClick = () => {
    if (loggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
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
          <span className={styles.icon}>🏠</span> {/* 🏠 Home Icon */}
        </Link>
        <Link href="/login">
          <span className={styles.icon}>👤</span>
        </Link>
        <Link href="/signup">
          <span className={styles.icon}>📝</span>
        </Link>
        <Link href="/cart">
          <span className={styles.icon}>
            🛍️ <span className={styles.cartCount}>0</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
