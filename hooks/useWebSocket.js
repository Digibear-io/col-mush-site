import { useContext, useEffect, useState } from "react";
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
  const [token, setState] = useState(settingsStore.getState().token);
  const [loggedIn, setLogIn] = useState(settingsStore.getState().loggedIn);
  const { setSocket } = useContext(SocketContext);

  useEffect(() => {
    settingsStore.subscribe(() => {
      setState(settingsStore.getState().token);
      setLogIn(settingsStore.getState().loggedIn);
    });
  }, []);

  const connect = ({ address, init = undefined }) => {
    const sock = new WebSocket(address);
    const convert = new Ansi({ newline: true });
    const textConv = new Ansi({ newline: true, escapeXML: true });

    // When the client connects, send this list of commands over the socket.
    sock.addEventListener(
      "open",
      () => {
        if (init && typeof init === "function") init(sock);
      },
      { once: true }
    );

    // add eventlistener for messages.
    sock.addEventListener("message", (e) => {
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
          console.log(data.token);
          settingsStore.dispatch(setToken(data.token));
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
          case text.startsWith("Either that player") && !loggedIn:
            console.log("bad login!");
            break;
          case text.startsWith("Last connect was from") && !loggedIn:
            console.log("logged in!");
            console.log(token);
            settingsStore.dispatch(setLoggedIn(true));
            settingsStore.dispatch(setConnected(true));
            break;
          default:
            if (text.length > 0 && loggedIn) {
              const txt = {
                cmd: "text",
                text,
                token,
              };
              historyStore.dispatch(setHistory(txt));
            }
        }
      }
    });
    setSocket(sock);
    return sock;
  };

  return {
    connect,
  };
}
