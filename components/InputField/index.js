import styles from "./InputField.module.css";

export default function InputField({
  placeholder,
  label,
  password = false,
  ...props
}) {
  return (
    <div className={styles.inputContainer}>
      <p className={styles.label}>{label}</p>
      {!password ? (
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          {...props}
        />
      ) : (
        <input
          className={styles.inputPassword}
          type={"password"}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  );
}
