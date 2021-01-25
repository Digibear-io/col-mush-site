import { useContext, useEffect, useRef, useState } from "react";
import Input from "../../components/Input/Input";
import styles from "./Client.module.css";
import Ansi from "ansi-to-html";
import Login from "../../components/Login/Login";
import Avatar from '../../components/Avatar'
import CharList, {List} from '../../components/CharList'
import {
  mobileStore,
  settingsStore,
  historyStore,
  menuStore,
  notificationStore,
  toggleReconnect
} from "../../store";
import { SocketContext } from "../../components/socketStore";



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
  const [toggle, setToggle] = useState(menuStore.getState());
  const [inWidth, setinWidth] = useState(0);
  const [winWidth, setWinWidth] = useState(0);
  const [outWidth, setOutWidth] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [characters, setChars] = useState(settingsStore.getState().characters);
  const [things, setThing] = useState(settingsStore.getState().things);
  const [exits, setExit] = useState(settingsStore.getState().exits);
  const output = useRef();
  const anchor = useRef();
  const { socket } = useContext(SocketContext);

  // Scroll the page down the first time there's overflow.  Normally
  // this means the room image + desc has been called.
  useEffect(() => {
    if (!scrolled && output.current.scrollHeight > window.innerHeight) {
      output.current.scrollTop = output.current.scrollHeight;
      setScrolled(!scrolled);
    } 
    
    setOutWidth(document.getElementById("output").offsetWidth);
    setWinWidth(window.innerWidth);
  });
    
  // Events loaded at initial render only.
  useEffect(() => {
    const input = document.getElementById("input");
    
    window.addEventListener("resize", (ev) => {
      setWinWidth(ev.target.innerWidth);
      setInHeight(input.offsetHeight + input.style.marginBottom);
      setinWidth(input.offsetWidth);
    });


    settingsStore.subscribe(() => {
      setToken(settingsStore.getState().token);
      setChars(settingsStore.getState().characters);
      setThing(settingsStore.getState().things);
      setExit(settingsStore.getState().exits);
    });
    menuStore.subscribe(() => setToggle(menuStore.getState()));
    historyStore.subscribe(() => setHist(historyStore.getState()));
    mobileStore.subscribe(() => setMobileContents(mobileStore.getState()));

  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
       
        <div className={styles.center}>
          <div
            style={{
              marginBottom:
                winWidth > 1200
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
                display: toggle && winWidth <= 1024 ? "flex" : "none",
              }}
            >
              <CharList title="Characters" list={characters} />
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
          <Input width={outWidth} hidden={winWidth < 1024 ? false : true} />
        </div>
        <div className={styles.right}>
          <CharList title="Characters" list={characters} />
          <List title="Things" list={things} />
          <List title="Exits" list={exits} />
        </div>
      </div>
      <Login />
    </div>
  );
}
