import { useEffect, useState, useRef } from "react";
import { menuStore, charStore, load, set } from "../../store";
import styles from "./Chargen.module.css";
import Fields from "../../components/Fields/Fields";
import Button from "../../components/Button/Button";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Chargen({ data }) {
  const [state, setState] = useState(charStore.getState());
  const [tog, setTog] = useState(menuStore.getState());
  const [faction, setFaction] = useState(charStore.getState().faction || 0);
  const [nam, setName] = useState(charStore.getState().name || "");
  const [lk, setLook] = useState(charStore.getState().name || "");
  const [ar, setAr] = useState(charStore.getState().archetype);
  const [dem, setDem] = useState(charStore.getState().name || "");
  const [archetype, setArchetype] = useState(
    data[charStore.getState().faction || 0].archetypes[
      charStore.getState().archetype || 0
    ]
  );

  const [bg, setBg] = useState(
    data[charStore.getState().faction || 0].archetypes[
      charStore.getState().archetype || 0
    ]?.image?.url
  );
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

    charStore.dispatch(
      set({ key: "name", value: names[rand(0, names.length - 1)].text })
    );
    charStore.dispatch(
      set({
        key: "demeanor",
        value: archetype.demeanor[rand(0, archetype.demeanor.length - 1)].text,
      })
    );
    charStore.dispatch(set({ key: "look", value: lk }));

    // If this is the first time (no saves) show base stats too!
    if (!state.saved) {
      [
        "heart",
        "blood",
        "mind",
        "spirit",
        "mortality",
        "night",
        "power",
        "wild",
      ].forEach((stat) => {
        charStore.dispatch(set({ key: stat, value: archetype[stat] }));
      });
    }
  };

  const handleFaction = (idx) => {
    // If this isn't the saved faction, then randomize things.
    if (idx !== faction) {
      charStore.dispatch(set({ key: "faction", value: idx }));
      setArchetype(data[idx].archetypes[0]);
      setBg(data[idx].archetypes[0]?.image?.url);
      randTop(data[idx].archetypes[0]);
    }
  };

  const handleArchetype = (idx) => {
    // if it's a new archetype, remove the highlighting and reset the stats!
    if (idx !== ar) {
      setArchetype(data[faction].archetypes[idx]);
      charStore.dispatch(set({ key: "archetype", value: idx }));
      setBg(data[faction].archetypes[idx]?.image?.url);
      randTop(data[faction].archetypes[idx]);
      charStore.dispatch(set({ key: "archetype", value: idx }));
      document.querySelectorAll("input[type=radio]").forEach((radio) => {
        charStore.dispatch(
          set({
            key: radio.value,
            value: data[faction].archetypes[idx][radio.value],
          })
        );

        // Reset the state stat values
        document.getElementById(radio.value).innerText =
          data[faction].archetypes[idx][radio.value];
      });
    }
  };

  const handleContinue = () => {
    charStore.dispatch(set({ key: "saved", value: true }));
    window.localStorage.setItem("state", JSON.stringify(state));
  };

  useEffect(() => {
    const storage = JSON.parse(window.localStorage.getItem("state"));
    charStore.subscribe(() => {
      setDem(charStore.getState().demeanor);
      setLook(charStore.getState().look);
      setName(charStore.getState().name);
      setState(charStore.getState());
      setFaction(charStore.getState().faction);
      setAr(charStore.getState().archetype);
      setArchetype(
        data[charStore.getState().faction || 0].archetypes[
          charStore.getState().archetype || 0
        ]
      );
      setBg(
        data[charStore.getState().faction || 0].archetypes[
          charStore.getState().archetype || 0
        ]?.image?.url
      );
    });

    if (storage && storage.saved) {
      charStore.dispatch(load(storage));
    }
    handleFaction(faction);

    menuStore.subscribe(() => setTog(menuStore.getState()));
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
          <div className={styles.factionBody}>
            <p>{data[faction]?.Description}</p>
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
            value={ar}
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
          <p className={styles.factionMobile}>{data[faction]?.Description}</p>
          <div className={styles.inputHolder}>
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
          </div>
          <Button
            outline
            onClick={() => randTop(archetype)}
            style={{ marginTop: "16px" }}
          >
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
          <div className={styles.buttonContainer}>
            <Button onClick={() => handleContinue()}>Continue</Button>
            <Button outline>Restart</Button>
          </div>
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
