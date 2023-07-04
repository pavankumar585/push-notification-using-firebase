// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyB7WxMrQjuEEaCG3Edrda-TjHakGmF4Qqc",
  authDomain: "push-notification-ef1e9.firebaseapp.com",
  projectId: "push-notification-ef1e9",
  storageBucket: "push-notification-ef1e9.appspot.com",
  messagingSenderId: "758016683407",
  appId: "1:758016683407:web:1c381a160ecfacfac1effa",
  measurementId: "G-VK4HZ3SPVF",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  //prettier-ignore
  console.log("[firebase-messaging-sw.js] Received background message ",payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
