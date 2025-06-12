import type { Metadata } from "next";
import "./globals.css";

import Header from "@/lib/ui/header"; // Import your Header component
import Footer from "@/lib/ui/footer"; // Import your Footer component

export const metadata: Metadata = {
  title: "Shopizon",
  description: "Shopizon - Your Online Shopping Destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
