"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { MdExitToApp } from "react-icons/md";
import { Input } from "@/lib/ui/components/input";
import { useCart } from "@/lib/ui/context/CartContext";
import { authClient } from "@/auth-client";
import { UserRole } from "@prisma/client";
import Drawer from "@/lib/ui/components/Drawer";
import Nav from "./Nav";
import { navItems } from "./navItems";

interface Product {
  id: string;
  name: string;
}

export default function Header() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
      // Import the server action dynamically to use in client component
      const { searchProducts } = await import(
        "@/lib/actions/db_product_actions"
      );
      const data = await searchProducts(query);
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    }
  };

  const handleSelect = (id: string) => {
    router.push(`/products/${id}`);
    setSearch("");
    setShowDropdown(false);
    setShowSearchBar(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
      setShowDropdown(false);
      setShowSearchBar(false);
    }
  };

  const handleSignOut = async () => {
    console.log("Logging out...");
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/");
        },
      },
    });
  };

  const handleAccountClick = async () => {
    const isLoggedIn = !!session?.user;
    console.log("Login/Logout button clicked. Logged in:", isLoggedIn);
    if (isLoggedIn) {
      await handleSignOut();
    } else {
      // User is not logged in - go to login page
      console.log("Navigating to login page...");
      router.push("/login");
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Shopizon"
              width={100}
              height={32}
              className="h-6 md:h-8"
            />
          </Link>

          {/* Desktop Search Bar - Hidden on mobile */}
          <form
            className="hidden md:flex relative flex-1 mx-8 max-w-lg"
            onSubmit={handleSubmit}
          >
            <Input
              type="text"
              placeholder="Search"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full"
              value={search}
              onChange={handleSearch}
              onFocus={() => search && setShowDropdown(true)}
            />
            {showDropdown && (
              <div className="absolute top-full left-0 w-full max-h-72 overflow-y-auto bg-white border border-gray-300 border-t-0 shadow-lg z-20">
                {results.length === 0 ? (
                  <div className="px-4 py-3 cursor-pointer border-b border-gray-100 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                    No results found
                  </div>
                ) : (
                  results.map((product) => (
                    <div
                      key={product.id}
                      className="px-4 py-3 cursor-pointer border-b border-gray-100 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                      onClick={() => handleSelect(product.id)}
                    >
                      {product.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </form>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* User greeting and dropdown - Desktop only */}
            {session?.user && (
              <div className="hidden md:flex items-center">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <FaUser className="text-gray-600" />
                    <span className="font-medium text-gray-700">
                      Hi, {session.user.name}
                    </span>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    <li>
                      <button
                        type="button"
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                        onClick={handleSignOut}
                      >
                        <MdExitToApp className="text-lg" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Desktop Cart - Hidden on mobile */}
            <Link
              href="/cart"
              className="hidden md:flex items-center gap-2 p-2 rounded transition-colors hover:bg-gray-100"
            >
              <FaShoppingCart className="text-lg" />
              <span className="text-sm font-bold">{cartCount}</span>
            </Link>

            {/* Desktop Login - Hidden on mobile, only show when not logged in */}
            {!session?.user && (
              <button
                type="button"
                className="hidden md:flex items-center gap-2 px-3 py-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={handleAccountClick}
              >
                <FaUser className="text-lg" />
                Login / Register
              </button>
            )}

            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2">
              {/* Search icon - Mobile only */}
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowSearchBar(!showSearchBar)}
              >
                <FaSearch className="text-lg" />
              </button>

              {/* Hamburger menu - Mobile only */}
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setIsDrawerOpen(true)}
              >
                <HiMenu className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <Nav />

      {/* Mobile Search Bar */}
      {showSearchBar && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <form className="relative" onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border border-gray-300 rounded-full"
                value={search}
                onChange={handleSearch}
                onFocus={() => search && setShowDropdown(true)}
                autoFocus
              />
              {showDropdown && (
                <div className="absolute top-full left-0 w-full max-h-72 overflow-y-auto bg-white border border-gray-300 border-t-0 shadow-lg z-10">
                  {results.length === 0 ? (
                    <div className="px-4 py-3 cursor-pointer border-b border-gray-100 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                      No results found
                    </div>
                  ) : (
                    results.map((product) => (
                      <div
                        key={product.id}
                        className="px-4 py-3 cursor-pointer border-b border-gray-100 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                        onClick={() => handleSelect(product.id)}
                      >
                        {product.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cartCount={cartCount}
      >
        <div className="p-4">
          {/* User greeting */}
          {session?.user && (
            <div className="flex items-center gap-3 p-3 mb-4 bg-gray-50 rounded-lg">
              <FaUser className="text-gray-600" />
              <span className="font-medium text-gray-700">
                Hi, {session.user.name}
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2">
            {/* Main navigation items */}
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href || "#"}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <IconComponent className="text-lg" />
                  {item.label}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Additional links */}
            <Link
              href="/"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsDrawerOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/cart"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cart
            </Link>

            {/* Vendor Dashboard - Only show for vendors */}
            {session?.user &&
              "role" in session.user &&
              session.user.role === UserRole.VENDOR && (
                <Link
                  href="/dashboard"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  📦 Vendor Dashboard
                </Link>
              )}

            {/* Login/Register - Only show when not logged in */}
            {!session?.user && (
              <button
                type="button"
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  handleAccountClick();
                  setIsDrawerOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <FaUser className="text-lg" />
                  Login / Register
                </div>
              </button>
            )}
          </nav>

          {/* Logout Button - Only show when logged in, positioned at bottom */}
          {session?.user && (
            <div className="absolute bottom-20 left-4 right-4">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={() => {
                  handleSignOut();
                  setIsDrawerOpen(false);
                }}
              >
                <MdExitToApp className="text-lg" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
