import styles from './BestsellerSection.module.css';

export default function BestsellerSection() {
  return (
    <section className={styles.bestsellerSection}>
      <h2>Popular This Week</h2>
      <p>Browse the most loved products by shoppers across Nova Scotia.</p>
      <button className={styles.button}>See Bestsellers</button>
      <div className={styles.productGrid}>
        <div className={styles.productCard}>Organic Kale</div>
        <div className={styles.productCard}>Wooden Bowl</div>
        <div className={styles.productCard}>Sourdough Bread</div>
      </div>
    </section>
  );
}
