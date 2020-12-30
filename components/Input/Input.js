import { useEffect, useRef, useState } from "react";
import styles from "./Input.module.css";

export default function Input({ socket }) {
  const input = useRef();
  const idx = useRef(-1);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
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
      }}
    ></div>
  );
}
