import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <p className={styles.logo}>CITY OF LIGHTS</p>
      </div>
    </nav>
  );
}
