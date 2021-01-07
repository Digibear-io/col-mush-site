import { useEffect, useState } from "react";
import { menuStore } from "../../store";
import styles from "./ChargenTemplate.module.css";
import Head from "next/head";

export default function ChargenTemplate({ left, children, title }) {
  const [tog, setTog] = useState(menuStore.getState());

  useEffect(() => {
    menuStore.subscribe(() => setTog(menuStore.getState()));
  }, []);

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>{title || "City of Lights MUSH"}</title>
      </Head>
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
