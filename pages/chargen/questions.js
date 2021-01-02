import { useEffect, useState } from "react";
import styles from "./Chargen.module.css";
import ArcImage from "../../components/ArcImage/ArcImage";
import ChargenTemplate from "../../components/ChargenTemplate/ChargenTemplate";
import Button from "../../components/Button/Button";

export default function Questions({ data, qdata }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const storage = window.localStorage.getItem("state");
    const store = JSON.parse(storage);
    console.log(data);
    setTitle(data[store.faction].archetypes[store.archetype].Name);
    setImage(data[store.faction].archetypes[store.archetype].image[0].url);
    setQuestions(data[store.faction].archetypes[store.archetype].Questions);
  }, []);

  return (
    <>
      <ChargenTemplate
        left={
          <>
            <h3
              style={{ borderBottom: "1px white solid", paddingBottom: "12px" }}
            >
              {qdata.title}
            </h3>
            <p style={{ padding: "16px 0", fontWeight: "lighter" }}>
              {qdata.description}
            </p>
          </>
        }
      >
        <h1>{title}</h1>
        <div className={styles.qHeaderMobile}>
          <h3>{qdata.title}</h3>
          <p>{qdata.description}</p>
        </div>
        {questions.map((group) => (
          <div>
            <h3 style={{ padding: "16px 0" }}>{group.Title}</h3>
            {group.Question.map((qs) => (
              <div>
                <h4 style={{ padding: "0 16px 16px 0" }}>{qs.text}</h4>
                <textarea id={qs._id} spellCheck={true} />
              </div>
            ))}
          </div>
        ))}
        <div
          className={styles.buttonContainer}
          style={{ margin: "0 0 24px 0" }}
        >
          <Button>Back</Button>
          <Button>Continue</Button>
        </div>
      </ChargenTemplate>
      <ArcImage src={image} title={title} />
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://lights-api.herokuapp.com/factions");
  const data = await res.json();
  const qs = await fetch("https://lights-api.herokuapp.com/intro-questions");
  const qdata = await qs.json();
  return { props: { data, qdata } };
}
