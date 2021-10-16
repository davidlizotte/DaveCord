// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDv5qUNSsXsilVUTuEKyg2p4_i9mxc1Lj4",
    authDomain: "discordserver-95266.firebaseapp.com",
    databaseURL: "https://discordserver-95266-default-rtdb.firebaseio.com",
    projectId: "discordserver-95266",
    storageBucket: "discordserver-95266.appspot.com",
    messagingSenderId: "436800369751",
    appId: "1:436800369751:web:3a10ccd660d726757b1f12"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/* Connects Javascript code to Firebase database */
let db = rtdb.getDatabase(app);
let auth = fbauth.getAuth(app);
let titleRef = rtdb.ref(db, "/");
let serverRef = rtdb.child(titleRef, "Servers");
let memberRef = rtdb.child(serverRef, "members");
let servernameRef = rtdb.child(serverRef, "ServerName");
let chatRef = rtdb.child(servernameRef, "chats");

export {auth, fbauth, serverRef, memberRef, chatRef, rtdb};
