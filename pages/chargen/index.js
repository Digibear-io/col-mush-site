import { useEffect, useState, useRef } from "react";
import {
  menuStore,
  charStore,
  name,
  look,
  demeanor,
  set,
  load,
} from "../../store";
import styles from "./Chargen.module.css";
import Fields from "../../components/Fields/Fields";
import Button from "../../components/Button/Button";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Chargen({ data }) {
  const [state, setState] = useState();
  const [tog, setTog] = useState(menuStore.getState());
  const [faction, setFaction] = useState(0);
  const [nam, setName] = useState("");
  const [lk, setLook] = useState("");
  const [dem, setDem] = useState("");
  const [archetype, setArchetype] = useState({});
  const [bg, setBg] = useState("");
  const selectRef = useRef();

  const randTop = (archetype) => {
    const names = archetype.Names;
    const clothing = archetype.clothing;
    const clothes = clothing[rand(0, clothing.length - 1)].text;
    const lk = `${["Male", "Female", "Ambiguous"][rand(0, 2)]}, ${
      [
        "Asian",
        "South Asian",
        "Black",
        "Hispanic/Latino",
        "Middle Eastern",
        "White",
      ][rand(0, 5)]
    }, ${clothes}.`;

    charStore.dispatch(name(names[rand(0, names.length - 1)].text));
    charStore.dispatch(
      demeanor(archetype.demeanor[rand(0, archetype.demeanor.length - 1)].text)
    );
    charStore.dispatch(look(lk));
  };

  const handleFaction = (idx) => {
    setFaction(idx);
    setArchetype(data[idx].archetypes[0]);
    setBg(data[idx].archetypes[0]?.image?.url);
    randTop(data[idx].archetypes[0]);
  };

  const handleArchetype = (idx) => {
    setArchetype(data[faction].archetypes[idx]);
    setBg(data[faction].archetypes[idx]?.image?.url);
    randTop(data[faction].archetypes[idx]);
    const radios = document.querySelectorAll("input[type=radio]");
    radios.forEach((radio) => {
      document.getElementById(radio.value).innerText = archetype[radio.value];
      radio.checked = false;
    });
  };

  const handleContinue = () => {
    window.localStorage.setItem("state", JSON.stringify(state));
  };

  useEffect(() => {
    const storage = JSON.parse(window.localStorage.getItem("state"));
    if (storage) charStore.dispatch(load(storage));
    menuStore.subscribe(() => setTog(menuStore.getState()));
    charStore.subscribe(() => {
      setDem(charStore.getState().demeanor);
      setLook(charStore.getState().look);
      setName(charStore.getState().name);
      setState(charStore.getState());
    });
    handleFaction(0);
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <select
            ref={selectRef}
            id={styles.standardSelect}
            onChange={(e) => handleFaction(e.target.value)}
          >
            {data.map((faction, idx) => {
              if (faction.archetypes.length > 0) {
                return (
                  <option key={faction._id} value={idx}>
                    {faction.Name}
                  </option>
                );
              }
            })}
          </select>
          <div className={styles.archetypes}>
            {data[faction].archetypes.map((archetype, idx) => (
              <div className={styles.avatarContainer} key={archetype?._id}>
                <img
                  className={styles.avatarLarge}
                  src={archetype?.image.url}
                  onClick={() => handleArchetype(idx)}
                />
                <p className={styles.caption}>{archetype?.Name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.center}>
          <select
            className={styles.mobileSelect}
            onChange={(e) => handleFaction(e.target.value)}
          >
            {data.map((faction, idx) => {
              if (faction.archetypes.length > 0) {
                return (
                  <option key={faction._id} value={idx}>
                    {faction.Name}
                  </option>
                );
              }
            })}
          </select>
          <h1 className={styles.title}>{archetype?.Name}</h1>
          <select
            className={styles.mobileTitle}
            onChange={(e) => handleArchetype(e.target.value)}
          >
            {data[faction].archetypes.map((archetype, idx) => {
              return (
                <option key={archetype._id} value={idx}>
                  {archetype.Name}
                </option>
              );
            })}
          </select>
          <div
            className={styles.mobileImage}
            style={{ backgroundImage: `url(${bg})` }}
          />
          <p className={styles.intro}>{archetype?.Body}</p>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Name:</p>
            <div className={styles.input} placeholder={nam} contentEditable />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Look:</p>
            <div className={styles.input} placeholder={lk} contentEditable />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>Demeanor:</p>
            <div className={styles.input} placeholder={dem} contentEditable />
          </div>
          <Button outline onClick={() => randTop(archetype)}>
            Randomize
          </Button>
          <div className={styles.statsContainer}>
            <Fields
              label="Stats"
              note="Choose +1"
              archetype={archetype}
              width="35%"
            />
            <Fields
              width="35%"
              label="Factions"
              faction
              note="Choose +1"
              archetype={archetype}
            />
          </div>
          <Button onClick={() => handleContinue()}>Continue</Button>
        </div>
        <div
          className={styles.right}
          style={{
            backgroundColor: tog ? "black" : "transparent",
          }}
        ></div>
      </div>

      <div className={styles.bottomTitle}>
        <p>{archetype?.Name}</p>
      </div>
      <div
        className={styles.archImage}
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className={styles.bar}></div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://lights-api.herokuapp.com/factions");
  const data = await res.json();
  return { props: { data } };
}
