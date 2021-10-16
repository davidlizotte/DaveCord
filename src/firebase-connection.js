import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDgXv9AS14Q6Gpnlx61n1qmVk8CB_eDv9c",
    authDomain: "davecord-ac92b.firebaseapp.com",
    databaseURL: "https://davecord-ac92b-default-rtdb.firebaseio.com",
    projectId: "davecord-ac92b",
    storageBucket: "davecord-ac92b.appspot.com",
    messagingSenderId: "667780713272",
    appId: "1:667780713272:web:a4809e79815960100d0fcd"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
/* Connects Javascript code to Firebase database */

let db = rtdb.getDatabase(app);
let auth = fbauth.getAuth(app);
let titleRef = rtdb.ref(db, "/");
let serverRef = rtdb.child(titleRef, "Servers");
let memberRef = rtdb.child(serverRef, "members");
let chatRef = rtdb.child(serverRef, "chats")

export {auth, fbauth, serverRef, memberRef, chatRef, rtdb};
