import styles from './Header.module.css';
import { Input } from '@/lib/ui/components/input';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="Shopizon" />
      </div>

      <div className={styles.searchWrapper}>
        <Input type="text" placeholder="Search" className={styles.searchInput} />
        <button className={styles.searchBtn}>
          <span>🔍</span>
        </button>
      </div>

      <div className={styles.icons}>
        <span className={styles.icon}>👤</span>
        <span className={styles.icon}>🛍️ <span className={styles.cartCount}>0</span></span>
      </div>
    </header>
  );
}
