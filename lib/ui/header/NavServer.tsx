import { getCategories } from "@/lib/actions/db_category_actions";
import NavClient from "./NavClient";

export default async function NavServer() {
  let categories = [];

  try {
    const dbCategories = await getCategories();
    categories = dbCategories.map((category) => ({
      id: category.id,
      name: category.name,
      href: `/products?category=${category.id}`,
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // Fallback to default categories if database fetch fails
    categories = [
      { id: "all", name: "All Categories", href: "/products" },
      {
        id: "electronics",
        name: "Electronics",
        href: "/products?category=electronics",
      },
      { id: "clothing", name: "Clothing", href: "/products?category=clothing" },
    ];
  }

  return <NavClient categories={categories} />;
}
