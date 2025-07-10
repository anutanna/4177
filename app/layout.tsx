import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import Header from "@/lib/ui/header/Header";
import Footer from "@/lib/ui/footer/Footer";
import { CartProvider } from '@/lib/ui/context/CartContext';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} antialiased`}>
        <CartProvider>
          <Header />
          <main className="container mx-auto p-4">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}


