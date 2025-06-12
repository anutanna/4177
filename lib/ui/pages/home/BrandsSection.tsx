import styles from './BrandsSection.module.css';

export default function BrandsSection() {
  return (
    <section className={styles.brandsSection}>
      <h2>Trusted Local Brands, All in One Place</h2>
      <p>
        Discover the most loved and unique brands from your region — curated for quality and community.
      </p>
      <div className={styles.brandGrid}>
        <div className={styles.brandCard}>FreshFarms</div>
        <div className={styles.brandCard}>Maritime Crafts</div>
        <div className={styles.brandCard}>Atlantic Bakery</div>
        <div className={styles.brandCard}>Ocean Bounty</div>
      </div>
      <button className={styles.button}>View All Brands</button>
    </section>
  );
}
