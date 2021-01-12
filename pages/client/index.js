import { useEffect, useRef, useState } from "react";
import Input from "../../components/Input/Input";
import styles from "./Client.module.css";
import Ansi from "ansi-to-html";
import Login from "../../components/Login/Login";
import {
  mobileStore,
  mobileMenuToggle,
  mobileMenuFalse,
  settingsStore,
  historyStore,
} from "../../store";

const List = ({ title, list }) => {
  return (
    <div
      className={styles.listContaner}
      style={{ display: list.length > 0 ? "block" : "none" }}
    >
      <p className={styles.listTitle}>{title}</p>
      {list.map((item) => {
        return <p className={styles.listEntry}>{item}</p>;
      })}
    </div>
  );
};

const Desc = ({ ic, image, name, location, description, ...props }) => {
  return (
    <div className={styles.descContainer} {...props}>
      <img src={image} />
      <h2>{name}</h2>
      <h4>{`${location},${ic ? "IC" : "OOC"}`}</h4>
      <p
        className={styles.descDesc}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

const Avatar = ({ children }) => {
  return (
    <div className={styles.avatarContainer}>
      <p>{children}</p>
    </div>
  );
};

const Say = ({ data }) => {
  const convert = new Ansi({ newline: true });
  return (
    <div className={styles.sayContainer}>
      <Avatar>{data.name.split("").shift()}</Avatar>
      <div className={styles.sayQuote}>
        <p className={styles.sayName}>{`${data.title && data.title}${
          data.name
        }${data.caption && data.caption}`}</p>
        <p
          className={styles.sayMessage}
          dangerouslySetInnerHTML={{ __html: convert.toHtml(data.text) }}
        ></p>
      </div>
    </div>
  );
};

export default function Client() {
  const [history, setHist] = useState(historyStore.getState());
  const [token, setToken] = useState(settingsStore.getState().token);
  const [inHeight, setInHeight] = useState(62);
  const [inWidth, setinWidth] = useState(0);
  const [winWidth, setWinWidth] = useState(500);
  const [outWidth, setOutWidth] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [things, setThings] = useState([]);
  const [exits, setExits] = useState([]);
  const [mobileContents, setMobileContents] = useState(mobileStore.getState());
  const output = useRef();
  const anchor = useRef();

  useEffect(() => {
    setOutWidth(output.current.offsetWidth);
    if (!scrolled && output.current.scrollHeight > window.innerHeight) {
      output.current.scrollTop = output.current.scrollHeight;
      setScrolled(!scrolled);
    }
  });

  useEffect(() => {
    if (winWidth > 1024) mobileStore.dispatch(mobileMenuFalse());
  }, [winWidth]);

  useEffect(() => {
    const input = document.getElementById("input");

    window.addEventListener("resize", (ev) => {
      setWinWidth(ev.target.innerWidth);
      setinWidth(input.offsetWidth);
    });

    input.addEventListener("keyup", (ev) => {
      setInHeight(ev.target.offsetHeight + ev.target.style.marginBottom);
    });

    settingsStore.subscribe(() => {
      setToken(settingsStore.getState().token);
    });
    historyStore.subscribe(() => setHist(historyStore.getState()));
    mobileStore.subscribe(() => setMobileContents(mobileStore.getState()));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <List title="Characters" list={characters} />
          <List title="Things" list={things} />
          <List title="Exits" list={exits} />
        </div>
        <div className={styles.center}>
          <div
            style={{
              marginBottom:
                winWidth >= 1024
                  ? `calc(${inHeight}px + 36px)`
                  : `calc(${inHeight}px + 16px)`,
            }}
            className={styles.output}
            id="output"
            ref={output}
          >
            <div
              className={styles.contentsMobile}
              style={{
                marginBottom: `calc(${inHeight}px)`,
                display: mobileContents ? "flex" : "none",
              }}
              hidden={mobileContents}
            >
              <img
                src="/close.svg"
                onClick={() => mobileStore.dispatch(mobileMenuToggle())}
              />

              <List title="Characters" list={characters} />
              <List title="Things" list={things} />
              <List title="Exits" list={exits} />
            </div>
            {history.map((data, idx) => {
              if (data.cmd === "desc" && token === data.token) {
                return (
                  <Desc
                    image={data.image || ""}
                    name={data.name || ""}
                    location={data.location || ""}
                    description={data.description}
                    key={idx}
                  />
                );
              }
              // If it's a text request.
              if (data.cmd === "text" && token === data.token) {
                return (
                  <div
                    dangerouslySetInnerHTML={{ __html: data.text }}
                    key={idx}
                  ></div>
                );
              }

              if (data.cmd === "say" && token == data.token) {
                return <Say data={data} key={idx} />;
              }
            })}
            <div className={styles.anchor} ref={anchor} />
          </div>
          <Input width={outWidth} hidden={winWidth <= 1024 ? false : true} />
        </div>
        <div className={styles.right}></div>
      </div>
      <Login />
    </div>
  );
}
