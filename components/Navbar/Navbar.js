import styles from "./Navbar.module.css";
import { menuStore, toggle } from "../../store";
import { useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";

function Navbar() {
  const [tog, setTog] = useState(menuStore.getState());
  const size = useWindowSize();

  menuStore.subscribe(() => setTog(menuStore.getState()));

  return (
    <nav className={styles.nav}>
      <div
        className={styles.inner}
        style={{ width: size.width <= 1400 ? "100%" : " 90%" }}
      >
        <p className={styles.logo}>CITY OF LIGHTS</p>
        <img
          className={styles.menuAction}
          src={tog ? "/close.svg" : "/menu.svg"}
          onClick={() => menuStore.dispatch(toggle())}
        />
      </div>
      <div
        className={styles.menuContainer}
        style={{ width: size.width <= 1400 ? "100%" : " 90%" }}
      >
        <div className={styles.menu} hidden={!tog}>
          <ul className={styles.links}>
            <li>
              <a>NEWS</a>
            </li>
            <li>
              <a>HELP</a>
            </li>
            <li>
              <a>THE CITY</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
