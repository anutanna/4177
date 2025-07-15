"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { Input } from "@/lib/ui/components/input";
import { useCart } from "@/lib/ui/context/CartContext";
import { authClient } from "@/auth-client";

interface Product {
  id: string;
  name: string;
}

export default function Header() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { cartCount } = useCart();

  // Use better-auth hooks
  const { data: session } = authClient.useSession();
  const { signOut } = authClient;

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
      const filtered = data.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    }
  };

  const handleSelect = (id: string) => {
    router.push(`/products/${id}`);
    setSearch("");
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
      setShowDropdown(false);
    }
  };

  const handleAccountClick = async () => {
    const isLoggedIn = !!session?.user;
    console.log("Login/Logout button clicked. Logged in:", isLoggedIn);
    if (isLoggedIn) {
      // User is logged in - logout
      console.log("Logging out...");
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
          },
        },
      });
    } else {
      // User is not logged in - go to login page
      console.log("Navigating to login page...");
      router.push("/login");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src="/logo.svg" alt="Shopizon" width={120} height={40} />
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

      {session?.user && (
        <span className={styles.userName}>👋 Hi, {session.user.name}</span>
      )}

      <div className={styles.icons}>
        <Link href="/">
          <span className={styles.icon}>🏠</span>
        </Link>
        {session?.user &&
          "role" in session.user &&
          session.user.role === "VENDOR" && (
            <Link href="/dashboard">
              <span className={styles.icon}>📦 Vendor</span>
            </Link>
          )}
        <button
          type="button"
          className={styles.icon}
          onClick={handleAccountClick}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          {session?.user ? "🚪 Logout" : "👤 Login"}
        </button>
        <Link href="/cart">
          <span className={styles.icon}>
            🛍️ <span className={styles.cartCount}>{cartCount}</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
