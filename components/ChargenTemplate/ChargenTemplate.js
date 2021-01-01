import styles from "./ChargenTemplate.module.css";

export default function ChargenTemplate({ left, right, children }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>{left}</div>
        <div className={styles.center}>{children}</div>
        <div className={styles.right}>{right}</div>
      </div>
    </div>
  );
}
