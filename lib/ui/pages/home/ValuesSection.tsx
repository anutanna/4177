import styles from './ValuesSection.module.css';

export default function ValuesSection() {
  return (
    <section className={styles.valuesSection}>
      <h2>Shop by What Matters Most</h2>
      <div className={styles.valueTags}>
        <span>Eco-Friendly</span>
        <span>Women-Owned</span>
        <span>Locally Made</span>
        <span>Organic</span>
      </div>
      <div className={styles.valuesBox}>
        <p className={styles.boxTitle}>Meet Your Makers</p>
        <p className={styles.boxSubtext}>
          Explore the people and purpose behind every product.
        </p>
        <button className={styles.button}>Learn More</button>
      </div>
    </section>
  );
}
