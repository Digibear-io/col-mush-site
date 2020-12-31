import { useEffect, useState } from "react";
import { charStore, set } from "../../store";

import styles from "./Fields.module.css";

export default function Fields({ label, note, faction, archetype }) {
  const [stats, setStats] = useState([]);
  const [state, setState] = useState(charStore.getState());
  const [name, setName] = useState("");

  useEffect(() => {
    switch (true) {
      case faction:
        setStats(["mortality", "night", "power", "wild"]);
        setName("faction");
        break;
      default:
        setStats(["blood", "heart", "mind", "spirit"]);
        setName("stats");
    }
    charStore.subscribe(() => setState(charStore.getState()));
  }, []);

  const handleRadio = (stat) => {
    const radios = document.getElementsByName(name);

    // Reset all of the stats
    radios.forEach((radio) => {
      charStore.dispatch(
        set({ key: radio.value, value: archetype[radio.value] })
      );
      document.getElementById(radio.value).innerText = archetype[radio.value];
    });
    charStore.dispatch(set({ key: stat, value: archetype[stat] + 1 }));
    document.getElementById(stat).innerText = archetype[stat] + 1;
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
                  type="radio"
                  name={name}
                  value={stat}
                  checked={state[stat] > archetype[stat] ? true : false}
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
