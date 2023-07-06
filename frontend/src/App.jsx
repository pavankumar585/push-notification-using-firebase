import { useState, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import messaging from "./config/firebase";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("count: ", count);
  }, [count]);

  useEffect(() => {
    const messageListener = onMessage(messaging, (payload) => {
      console.log("foreground-message: ", payload);
      setCount((prevCount) => prevCount + 1);

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
      };

      new Notification(notificationTitle, notificationOptions);
    });

    return () => {
      messageListener();
    };
  }, []);

  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        //prettier-ignore
        const token = await getToken(messaging, { vapidKey: import.meta.env.FIRE_BASE_VAPID_KEY });
        console.log("token: ", token);
      }

      if (permission === "denied") {
        alert("You denied notification permission");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={requestPermission}>Get Token</button>
    </>
  );
}

export default App;
