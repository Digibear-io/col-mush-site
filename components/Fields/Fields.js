import { arch } from "os";
import { useEffect, useState } from "react";
import { charStore, set } from "../../store";

import styles from "./Fields.module.css";

export default function Fields({ label, note, faction, archetype }) {
  const [stats, setStats] = useState([]);
  const [state, setState] = useState(charStore.getState());
  const [name, setName] = useState("");

  useEffect(() => {
    charStore.subscribe(() => setState(charStore.getState()));
    switch (true) {
      case faction:
        setStats(["mortality", "night", "power", "wild"]);
        handleRadio();
        setName("faction");
        break;
      default:
        setStats(["blood", "heart", "mind", "spirit"]);
        handleRadio();
        setName("stats");
    }
  }, []);

  const handleRadio = (stat = "") => {
    // Reset the radio buttons.
    document.getElementsByName(name).forEach((radio) => {
      charStore.dispatch(
        set({ key: radio.value, value: archetype[radio.value] })
      );
      radio.checked = false;
      document.getElementById(radio.value).innerText = archetype[radio.value];
    });

    // If the stat has been given, set it.
    if (stat) {
      charStore.dispatch(set({ key: stat, value: archetype[stat] + 1 }));
      document.getElementById(stat).innerText = archetype[stat] + 1;

      // Check the stat's radio button for style!
      document.getElementsByName(name).forEach((radio) => {
        if (radio.value === stat) {
          radio.checked = true;
        }
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          {label && <p className={styles.label}>{label}</p>}
          {note && <p className={styles.note}>{`(${note})`}</p>}
        </div>
        <ul>
          {stats.map((stat, idx) => (
            <li key={idx} className={styles.list}>
              <div className={styles.row}>
                <p>{stat}</p>
                <input
                  checked={state[stat] > archetype[stat]}
                  type="radio"
                  name={name}
                  value={stat}
                  onChange={() => handleRadio(stat)}
                />
                <div className={styles.value} id={stat}>
                  {state[stat]}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
