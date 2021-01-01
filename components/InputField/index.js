import styles from "./InputField.module.css";

export default function InputField({ placeholder, label, ...props }) {
  return (
    <div className={styles.inputContainer}>
      <p className={styles.label}>{label}</p>
      <div
        className={styles.input}
        placeholder={placeholder}
        contentEditable
        {...props}
      />
    </div>
  );
}
