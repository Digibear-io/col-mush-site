import styles from "./Button.module.css";

export default function Button({ children, outline, ...props }) {
  return (
    <a
      className={styles.container}
      {...props}
      style={{
        backgroundColor: outline ? "transparent" : " #1a1a1a",
        border: `${outline ? "white" : "#373737"} 1px solid`,
      }}
    >
      {children}
    </a>
  );
}
