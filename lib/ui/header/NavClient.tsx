"use client";

import React from "react";
import Link from "next/link";
import { FaChevronDown, FaCubes } from "react-icons/fa";

interface Category {
  id: string;
  name: string;
  href: string;
}

interface NavClientProps {
  categories: Category[];
}

export default function NavClient({ categories }: NavClientProps) {
  return (
    <nav className="hidden md:block w-full shadow-md relative bg-gradient-to-r from-[#21C1B9] to-[#1A71D5] z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start">
          {/* Browse dropdown with dynamic categories */}
          <div className="dropdown dropdown-hover">
            <button
              tabIndex={0}
              className="flex items-center gap-2 px-4 py-3 text-white font-medium hover:bg-white/20 transition-colors duration-200 dropdown-toggle"
            >
              <FaCubes className="text-white" />
              <span className="text-white">Browse</span>
              <FaChevronDown className="text-white text-xs" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-white rounded-box w-48"
            >
              {/* Add "All Categories" option first */}
              <li>
                <Link
                  href="/products"
                  className="text-gray-700 hover:bg-gray-100"
                >
                  All Categories
                </Link>
              </li>
              {/* Add dynamic categories from database */}
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
