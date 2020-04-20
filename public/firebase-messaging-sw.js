importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js');


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDPzvajjpPB6BBAlG53hFvBXjLI9UvOuGs",
  authDomain: "chat-app-35b32.firebaseapp.com",
  databaseURL: "https://chat-app-35b32.firebaseio.com",
  projectId: "chat-app-35b32",
  storageBucket: "chat-app-35b32.appspot.com",
  messagingSenderId: "458045343244",
  appId: "1:458045343244:web:eb51d57a20f0aa07279029",
  measurementId: "G-TK37RZGGZE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] %%%%%% Received background message ', payload.data.message);
  // Customize notification here
  const notificationTitle = 'You have new message !';
  const notificationOptions = {
    body: payload.data.message,
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});