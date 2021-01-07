import { useEffect, useRef, useState } from "react";
import Input from "../../components/Input/Input";
import styles from "./Client.module.css";
import Ansi from "ansi-to-html";

const Desc = ({ ic, image, name, location, description }) => {
  return (
    <div className={styles.descContainer}>
      <img src={image} />
      <h2>{name}</h2>
      <h4>{`${location}, ${ic ? "IC" : "OOC"}`}</h4>
      <p>{description}</p>
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
        <p dangerouslySetInnerHTML={{ __html: convert.toHtml(data.text) }}></p>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <div>
      <p style={{ color: "rgba(255,255,255,.7)", marginTop: "50px" }}>
        Welcome to
      </p>
      <h2>The City of Lights MUSH</h2>
      <img
        src="https://i.imgur.com/KB4wxBW.png"
        style={{
          objectFit: "cover",
          height: "50vh",
          width: "100%",
          padding: "16px 0",

          flexGrow: 1,
        }}
      />
      <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
        {"The Following Commands are available:"}
      </p>

      <ul style={{ marginLeft: "16px", marginBottom: "24px" }}>
        <li>{"Create  <name> <password>"}</li>
        <li>{"Connect <name> <password>"}</li>
        <li>{"WHO"}</li>
        <li>{"QUIT"}</li>
      </ul>
    </div>
  );
};

export default function Client() {
  const [socket, setSocket] = useState();
  const [history, setHistory] = useState([]);
  const [token, setToken] = useState("");
  const [inHeight, setInHeight] = useState(62);
  const [inWidth, setinWidth] = useState(0);
  const [winWidth, setWinWidth] = useState(500);
  const [outWidth, setOutWidth] = useState(0);
  const [scrolled, setScrolled] = useState(false);
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
    const sock = new WebSocket("ws://lights.digibear.io:2861");
    setSocket(sock);
    window.sessionStorage.removeItem("token");
    const convert = new Ansi({ newline: true });

    sock.addEventListener("open", () => {
      sock.send("json");
      sock.send("showlogin");
    });

    sock.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(convert.toHtml(e.data));
        if (data.cmd === "token") {
          setToken(data.token);
          window.sessionStorage.setItem("token", data.token);
        } else {
          setHistory((v) => [...v, data]);
        }
      } catch {
        const str = e.data.toString();
        let text = convert.toHtml(str.replace(/\r\n$/, ""));
        if (text.length > 0) {
          const txt = {
            cmd: "text",
            text,
            token: window.sessionStorage.getItem("token"),
          };
          setHistory((v) => [...v, txt]);
        }
      }
    });

    const input = document.getElementById("input");

    window.addEventListener("resize", (ev) => {
      setWinWidth(ev.target.innerWidth);
      setinWidth(input.offsetWidth);
    });

    input.addEventListener("keyup", (ev) => {
      setInHeight(ev.target.offsetHeight + ev.target.style.marginBottom);
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}></div>
        <div className={styles.center}>
          <div
            style={{
              marginBottom:
                inWidth < winWidth
                  ? `calc(${inHeight}px + 36px)`
                  : `calc(${inHeight}px + 16px)`,
            }}
            className={styles.output}
            id="output"
            ref={output}
          >
            {history.map((data) => {
              if (data.cmd === "desc" && token === data.token) {
                return (
                  <Desc
                    image={data.image || ""}
                    name={data.name || ""}
                    location={data.location || ""}
                    description={data.description}
                  />
                );
              }

              // If it's a text request.
              if (data.cmd === "text" && token === data.token) {
                return (
                  <div dangerouslySetInnerHTML={{ __html: data.text }}></div>
                );
              }

              if (data.cmd === "say" && token == data.token) {
                return <Say data={data} />;
              }

              if (data.cmd === "login") {
                return <Login />;
              }
            })}
            <div className={styles.anchor} ref={anchor} />
          </div>
          <Input socket={socket} width={outWidth} />
        </div>
        <div className={styles.right}></div>
      </div>
    </div>
  );
}
