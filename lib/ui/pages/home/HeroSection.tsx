import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <h1>Explore the Best of Local. Sell With Ease.</h1>
      <button className={styles.button}>Start Shopping</button>
    </section>
  );
}
