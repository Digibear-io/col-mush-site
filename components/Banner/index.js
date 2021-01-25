import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { notificationStore, setBanners } from "../../store";
import { Close } from "../icons";
import styles from "./Banner.module.css";


const colors = {
  ok: "#1FAF00",
  warning: "#ACB000",
  danger: "#5f0000",
}

export default function Banner({ text }) {
  const [banners, setBanner] = useState(notificationStore.getState().banners)


  useEffect(() => {
    notificationStore.subscribe(() => setBanner(notificationStore.getState().banners))
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
          <p>This is a single banner</p>
        <Close color="white" style={{ height: "24px", width: "24px", marginRight: "16px", marginLeft: "auto"}}/>
        </div>
    </div>
  );
}
