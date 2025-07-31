import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import Header from "@/lib/ui/header/Header";
import Footer from "@/lib/ui/footer/Footer";
import { CartProvider } from "@/lib/ui/context/CartContext";
import { getCategories } from "@/lib/actions/db_category_actions";

export const metadata: Metadata = {
  title: "Shopizon",
  description: "Shopizon - Your Online Shopping Destination",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch categories for navigation
  let categories: Array<{ id: string; name: string }> = [];
  try {
    const dbCategories = await getCategories();
    categories = dbCategories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  } catch (error) {
    console.error("Failed to fetch categories for navigation:", error);
    // Continue with empty categories array as fallback
  }

  return (
    <html lang="en" data-theme="light">
      <body
        className={`${inter.className} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Header categories={categories} />
          <main className="container mx-auto p-4 flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
