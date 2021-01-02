import styles from "./ArcImage.module.css";

export default function ArcImage({ src, title }) {
  return (
    <div
      className={styles.archImage}
      style={{ backgroundImage: `url(${src})` }}
    >
      <div className={styles.bottomTitle}>
        <p>{title}</p>
      </div>
      <div className={styles.bar}></div>
    </div>
  );
}
