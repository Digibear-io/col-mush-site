import { useEffect, useRef, useState } from "react";
import Input from "../../components/Input/Input";
import styles from "./Client.module.css";
import Ansi from "ansi-to-html";

export default function Client() {
  const [socket, setSocket] = useState();
  const output = useRef();
  const anchor = useRef();

  useEffect(() => {
    const convert = new Ansi({ escapeXML: true, newline: true });
    const sock = new WebSocket("ws://lights.digibear.io:2861");
    setSocket(sock);
    sock.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data.replace(/\r\n/g, ""));
        console.log("JSON!");
      } catch {
        let text = convert.toHtml(e.data.replace(/\r\n$/, ""));
        if (text.length > 0) {
          const div = document.createElement("div");
          div.innerHTML = text;
          output.current.insertBefore(div, anchor.current);
        }
      }
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.output} ref={output}>
          <div className={styles.anchor} ref={anchor} />
        </div>
        <Input socket={socket} />
      </div>
    </div>
  );
}
