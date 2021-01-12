import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Input.module.css";
import {
  mobileMenuToggle,
  mobileStore,
  setInputHeight,
  settingsStore,
} from "../../store";
import { SocketContext } from "../socketStore";

export default function Input({ width, hidden }) {
  const input = useRef();
  const idx = useRef(-1);
  const [history, setHistory] = useState([]);
  const [toggle, setToggle] = useState(mobileStore.getState());
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    input.current.focus();
    mobileStore.subscribe(() => setToggle(mobileStore.getState()));
  }, []);

  return (
    <div
      className={styles.wrapper}
      id="input"
      style={{
        width,
      }}
    >
      <img
        src="/person_search-white-18dp.svg"
        className={styles.contentsButton}
        hidden={hidden}
        style={{ opacity: toggle ? 0.2 : 0.4 }}
        onClick={() => mobileStore.dispatch(mobileMenuToggle())}
      />
      <div
        ref={input}
        className={styles.container}
        contentEditable
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            try {
              socket.send(input.current.innerText);
              setHistory([...history, input.current.innerText]);
              idx.current += 1;

              input.current.innerText = "";
            } catch {
              socket.connect("ws://lights.digibear.io:2861");
              input.current.innerText = "";
            }
          }

          if (e.ctrlKey && e.key == "ArrowUp") {
            e.preventDefault();
            if (idx.current - 1 <= 0) {
              idx.current = 0;
              input.current.innerText = history[0];
            } else {
              input.current.innerText = history[idx.current--];
            }
          }

          if (e.ctrlKey && e.key == "ArrowDown") {
            e.preventDefault();
            if (idx.current + 1 >= history.length - 1) {
              idx.current = history.length - 1;
              input.current.innerText = history[history.length - 1];
            } else {
              input.current.innerText = history[idx.current++];
            }
          }

          settingsStore.dispatch(setInputHeight(input.current.clientHeight));
        }}
      ></div>
    </div>
  );
}
