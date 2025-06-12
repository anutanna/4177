import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Shopizon",
  description: "Shopizon - Your Online Shopping Destination",
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
