import styles from './Reconnect.module.css'
import { useEffect, useState } from 'react'
import { notificationStore, settingsStore } from '../../store'

export default function Reconnect() {
    const [state, setState] = useState(notificationStore.getState().reconnect);
    const [logedin, setLogin] = useState(settingsStore.getState().loggedIn);
    
    const handleConnect = () => {
        connect({
          address: "ws://lights.digibear.io:2861",
          handlers:{
            connect: (socket) => {
                  socket.send(`connect ${settingsStore.getState().name} ${settingsStore.getState().password}`);
            },
            login: (socket) => socket.send(`@token ${generate()}`)
          },
        });
      };

    useEffect(() => {
        settingsStore.subscribe(() => setLogin(settingsStore.getState().loggedIn));
        notificationStore.subscribe(() =>
            setState(notificationStore.getState().reconnect)
        );
    }, [])

    return (
        <div className={styles.container} style={{
            display: state ? "flex" : "none"
        }}>
            <p>Offline</p>
          <button onClick={handleConnect}>Reconnect</button>  
        </div>
    )
}