'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const token = data.token;
        localStorage.setItem('token', token);
      
        // ✅ sync local cart to server
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: localCart }),
        });
      
        // Redirect or do something
      } else {
        console.error(data.error);
      }
      


      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store token + user data including role
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('role', data.user.role); 

      router.push('/');
      window.location.reload();
    } catch {
      setError('Unexpected error, please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <h1 className={styles.title}>Log In</h1>
          {error && <p className={styles.errorMsg}>{error}</p>}

          <div>
            <label htmlFor="email" className={styles.fieldLabel}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={styles.fieldInput}
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.fieldLabel}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={styles.fieldInput}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Sign In</button>

          <div className="text-center mt-4">
            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>
          <div className="text-center mt-2">
            <a href="/signup" className="text-sm text-gray-700 hover:underline">
              New user? Sign up here
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}
