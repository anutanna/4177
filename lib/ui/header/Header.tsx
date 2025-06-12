import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Shopizon</div>
      <nav className={styles.nav}>
        <a href="#">Shop</a>
        <a href="#">Vendors</a>
        <a href="#">Sign In</a>
        <a href="#" className={styles.ctaButton}>Join as a Vendor</a>
      </nav>
    </header>
  );
}
