import { useContext, useEffect, useRef, useState } from "react";
import Ansi from "ansi-to-html";
import {
  historyStore,
  setHistory,
  settingsStore,
  setCharacters,
  setThings,
  setExits,
  setConnected,
  setLoggedIn,
  setToken,
} from "../store";
import { SocketContext } from "../components/socketStore";

export default function useWebsocket() {
  const [token, setState] = useState("");
  const [connected, setConnect] = useState(settingsStore.getState().connected);
  const [login, setLogIn] = useState(settingsStore.getState().loggedIn);
  const { setSocket } = useContext(SocketContext);
  const sock = useRef();
  const init = useRef();

  const handleOpen = () => {
    console.log("init!!!");
    init.current(sock.current);
  };

  const handleMessage = (e) => {
    const convert = new Ansi({ newline: true });
    const textConv = new Ansi({ newline: true, escapeXML: true });

    try {
      // This gets a little tricky, so I'll explain it. :)
      // Rhost, when it sends a string that has ansi codes in it will end the string with
      // an ansi clear code.  We have to get rid of that before we can try to read the
      // line of text for json.
      const data = JSON.parse(
        // Convert any ansi to html markup.
        convert
          // Remove any possible ansi clear from the end of the string.
          .toHtml(e.data.replace(/\u001b\[0m$/, ""))
          // I found it easier to just replace the style tag double quotes to singles.
          // I'm sure there are better solutions out there.  This one worked for now. :D
          .replace(/style="([^"]+)"/g, "style='$1'")
      );
      // If the JSON is a token update, handle it.
      if (data.cmd === "token") {
        settingsStore.dispatch(setToken(data.token));
        setState(data.token);
        // If it's a contents update, do eet.
      } else if (data.cmd === "objects") {
        settingsStore.dispatch(setCharacters(data.characters));
        settingsStore.dispatch(setThings(data.things));
        settingsStore.dispatch(setExits(data.exits));
        // Else just send the the data to the history and let the action store
        // sort it out. :)
      } else {
        historyStore.dispatch(setHistory(data));
      }
    } catch {
      const str = e.data.toString();
      let text = textConv.toHtml(str.replace(/\r\n$/, ""));

      // If the user isn't connected, and they get an failure message
      // at the login screen, handle it here.
      switch (true) {
        case text.startsWith("Either that player") && !login:
          console.log("bad login!");
          break;
        case text.startsWith("Last connect was from") && !login:
          console.log("logged in!");
          settingsStore.dispatch(setLoggedIn(true));
          break;
        case text.match(/.*Welcome.*/) && !login:
          console.log("connected!");
          settingsStore.dispatch(setConnected(true));

          break;
        default:
          console.log(token);
          if (text.length > 0 && login) {
            const txt = {
              cmd: "text",
              text,
              token,
            };
            historyStore.dispatch(setHistory(txt));
          }
      }
    }
  };

  useEffect(() => {
    settingsStore.subscribe(() => {
      setConnect(settingsStore.getState().connected);
      setLogIn(settingsStore.getState().loggedIn);
    });
  }, []);

  useEffect(() => {
    if (!sock.current && !init.current) return;

    // add eventlistener for messages.
    sock.current.addEventListener("message", handleMessage);
    return () => sock.current.removeEventListener("message", handleMessage);
  }, [sock.current, login, token]);

  useEffect(() => {
    if (!init.current) return;

    sock.current.addEventListener("open", handleOpen, { once: true });
    return () => sock.current.removeEventListener("open", handleOpen);
  }, [connected, init.current]);

  const connect = ({ address, initi = undefined }) => {
    init.current = initi;
    sock.current = new WebSocket(address);
    setSocket(sock.current);
  };

  return {
    connect,
  };
}
