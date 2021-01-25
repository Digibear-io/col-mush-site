import { useEffect, useState } from "react";
import { settingsStore, setPassword, setName } from "../../store";
import styles from "./Login.module.css";
import InputField from "../InputField/index";
import Button from "../Button/Button";
import useWebsocket from "../../hooks/useWebSocket";
import { generate } from "shortid";

function Login() {
  const [name, setNam] = useState("");
  const [password, setPass] = useState("");
  const [login, setLogin] = useState(settingsStore.getState().loggedIn);

  const { connect } = useWebsocket();

  useEffect(() => {
    settingsStore.subscribe(() => setLogin(settingsStore.getState().loggedIn));
  }, []);

  const handleConnect = () => {
    connect({
      address: "ws://lights.digibear.io:2861",
      handlers:{
        connect: (socket) => {
          settingsStore.dispatch(setName(name));
          settingsStore.dispatch(setPassword(password));
          socket.send(`connect ${name} ${password}`);
        },
        login: (socket) => socket.send(`@token ${generate()}`)
      },
    });
  };

  const handleCreate = () => {
    console.log("connecting!");
    connect({
      address: "ws://lights.digibear.io:2861",
      handlers:{
        connect: (socket) => {
          settingsStore.dispatch(setName(name));
          settingsStore.dispatch(setPassword(password));
          socket.send(`connect ${name} ${password}`);
        },
        login: (socket) => socket.send(`@token ${generate()}`)
      },
    });
  };

  return (
    <div
      className={styles.wrapper}
      style={{ display: login ? "none" : "flex" }}
    >
      <div className={styles.container}>

      <p className={styles.subheader}>Welcome to</p>
      <h2 className={styles.header}>The City of Lights MUSH</h2>
      <img src="https://i.imgur.com/KB4wxBW.png" />
      <div className={styles.inputs}>
        <InputField
          placeholder="Character Name"
          onChange={(e) => setNam(e.target.value)}
        />
        <InputField
          placeholder="Password"
          onChange={(e) => setPass(e.target.value)}
            password
            onKeyDown={e => {
              if(e.key === "Enter") handleConnect()
            }}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={handleConnect}>Connect</Button>
        <Button outline onClick={handleCreate}>
          Register
        </Button>
      </div>
      </div>
    </div>
  );
}

export default Login;
