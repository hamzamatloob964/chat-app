import * as firebase from 'firebase/app';
import '@firebase/messaging';
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";


const Firebase = firebase.initializeApp({
  apiKey: "AIzaSyDPzvajjpPB6BBAlG53hFvBXjLI9UvOuGs",
  authDomain: "chat-app-35b32.firebaseapp.com",
  projectId: "chat-app-35b32",
  storageBucket: "chat-app-35b32.appspot.com",
  databaseURL:'https://chat-app-35b32.firebaseio.com/',
  messagingSenderId: "458045343244",
  appId: "1:458045343244:web:eb51d57a20f0aa07279029",
  measurementId: "G-TK37RZGGZE"
});

// navigator.serviceWorker
//   .register('/firebase-messaging-sw.js')
//   .then((registration) => {
//     firebase.messaging().useServiceWorker(registration);
//   });

export default Firebase;