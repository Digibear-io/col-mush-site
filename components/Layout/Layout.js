import Navbar from "../Navbar/Navbar";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.main}>
      <Navbar />
      {children}
    </div>
  );
}
