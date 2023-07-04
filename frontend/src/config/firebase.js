import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB7WxMrQjuEEaCG3Edrda-TjHakGmF4Qqc",
  authDomain: "push-notification-ef1e9.firebaseapp.com",
  projectId: "push-notification-ef1e9",
  storageBucket: "push-notification-ef1e9.appspot.com",
  messagingSenderId: "758016683407",
  appId: "1:758016683407:web:1c381a160ecfacfac1effa",
  measurementId: "G-VK4HZ3SPVF",
};

const app = initializeApp(firebaseConfig);
export default getMessaging(app);
