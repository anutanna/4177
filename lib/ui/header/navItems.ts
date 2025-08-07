import { FaCubes } from "react-icons/fa";

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  hasDropdown: boolean;
  dropdownItems?: string[];
}

export const navItems: NavItem[] = [
  {
    label: "Browse",
    icon: FaCubes,
    href: "/products",
    hasDropdown: true,
    dropdownItems: [
      "All Categories",
      "Electronics",
      "Clothing",
      "Home & Garden",
      "Sports & Outdoors",
      "Books & Media",
    ],
  },
];
