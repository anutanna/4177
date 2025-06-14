import styles from './LatestProductsSection.module.css';
import { Button } from '@/lib/ui/components/button';
import { Card, CardContent } from '@/lib/ui/components/card';

const products = [
  { name: "Mug", price: "$15.00", rating: 200, image: "/images/mug.jpg" },
  { name: "Vase", price: "$35.00", rating: 50, image: "/images/vase.jpg" },
  { name: "Toy Train", price: "$15.00", rating: 25, image: "/images/train.jpg" },
  { name: "Umbrella", price: "$45.00", rating: 50, image: "/images/umbrella.jpg" },
];

export default function LatestProductsSection() {
  return (
    <section className={styles.latestProducts}>
      <h3 className={styles.heading}>Latest Products</h3>
      <div className={styles.grid}>
        {products.map((product, i) => (
          <Card key={i} className={styles.card}>
            <CardContent className={styles.cardContent}>
              <img src={product.image} alt={product.name} className={styles.image} />
              <p className={styles.price}>{product.price}</p>
              <p className={styles.rating}>★ {product.rating}</p>
              <Button className={styles.button}>+1</Button>

            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
