import {
  FaCubes,
  FaTag,
  FaHeart,
  FaList,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";

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
  {
    label: "Promotions",
    icon: FaTag,
    href: "/promotions",
    hasDropdown: false,
  },
  {
    label: "Favourites",
    icon: FaHeart,
    href: "/favourites",
    hasDropdown: false,
  },
  {
    label: "Lists",
    icon: FaList,
    href: "/lists",
    hasDropdown: false,
  },
];
