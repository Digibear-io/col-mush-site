import { useEffect, useState } from "react";
import { menuStore } from "../../store";
import styles from "./ChargenTemplate.module.css";

export default function ChargenTemplate({ left, children }) {
  const [tog, setTog] = useState(menuStore.getState());

  useEffect(() => {
    menuStore.subscribe(() => setTog(menuStore.getState()));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>{left}</div>
        <div className={styles.center}>{children}</div>
        <div
          className={styles.right}
          style={{
            backgroundColor: tog ? "black" : "transparent",
          }}
        />
      </div>
    </div>
  );
}
