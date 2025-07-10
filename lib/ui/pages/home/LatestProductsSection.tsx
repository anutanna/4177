"use client";

import { useEffect, useState } from "react";
import styles from "./LatestProductsSection.module.css";
import ProductCard from "@/lib/ui/components/productCard";

type Product = {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
};

export default function LatestProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <section className={styles.latestProducts}>
      <h3 className={styles.heading}>Latest Products</h3>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.images[0]?.url || "/placeholder.jpg"}
            price={`${product.price}`}
            id={product.id}
          />
        ))}
      </div>
    </section>
  );
}
