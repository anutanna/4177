"use client";

import React from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { navItems } from "./navItems";

interface Category {
  id: string;
  name: string;
}

interface NavProps {
  categories?: Category[];
}

export default function Nav({ categories = [] }: NavProps) {
  return (
    <nav className="hidden md:block w-full shadow-md relative bg-gradient-to-r from-[#21C1B9] to-[#1A71D5] z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return item.hasDropdown ? (
              <div key={index} className="dropdown dropdown-hover">
                <button
                  tabIndex={0}
                  className="flex items-center gap-2 px-4 py-3 text-white font-medium hover:bg-white/20 transition-colors duration-200 dropdown-toggle"
                >
                  <IconComponent className="text-white" />
                  <span className="text-white">{item.label}</span>
                  <FaChevronDown className="text-white text-xs" />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-white rounded-box w-48"
                >
                  {/* For Browse dropdown, use dynamic categories if available, otherwise fallback to hardcoded */}
                  {item.label === "Browse" ? (
                    <>
                      <li>
                        <Link
                          href="/products"
                          className="text-gray-700 hover:bg-gray-100"
                        >
                          All Categories
                        </Link>
                      </li>
                      {categories.length > 0
                        ? categories.map((category) => (
                            <li key={category.id}>
                              <Link
                                href={`/products?category=${category.id}`}
                                className="text-gray-700 hover:bg-gray-100"
                              >
                                {category.name}
                              </Link>
                            </li>
                          ))
                        : item.dropdownItems?.map((dropdownItem, idx) => (
                            <li key={idx}>
                              <a className="text-gray-700 hover:bg-gray-100">
                                {dropdownItem}
                              </a>
                            </li>
                          ))}
                    </>
                  ) : (
                    item.dropdownItems?.map((dropdownItem, idx) => (
                      <li key={idx}>
                        <a className="text-gray-700 hover:bg-gray-100">
                          {dropdownItem}
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ) : (
              <Link
                key={index}
                href={item.href || "#"}
                className="flex items-center gap-2 px-4 py-3 text-white font-medium hover:bg-white/20 transition-colors duration-200"
              >
                <IconComponent className="text-white" />
                <span className="text-white">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
