import styles from './SimpleSection.module.css';

export default function SimpleSection() {
  return (
    <section className={styles.simpleSection}>
      <h2>Simple for Sellers. Seamless for Shoppers.</h2>
      <p>
        Shopizon helps you run your local marketplace online — so you can grow your business without the tech stress.
      </p>
      <button className={styles.button}>Get Started</button>
    </section>
  );
}
