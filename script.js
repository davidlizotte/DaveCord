  

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
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


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

let username;
let messageID = 0; // message id to keep track of incoming messages in the database

// Check from database how many messages are stored to make our "messageID" more accurate
rtdb.get(chatRef).then(ss=>{
    ss.forEach(element => {
        messageID = messageID + 1;
    });
});

document.addEventListener("DOMContentLoaded", ()=>{
  const loginform = document.querySelector("#login");
  const createaccountform = document.querySelector("#createaccount");
  
  dosument.querySelector("#linkcreateaccount").addEventListener("click", e =>{
    e.preventDefault();
    loginForm.classList.add("form-hidden");
    createAccountForm.classList.remove(form-hidden);
  });
  dosument.querySelector("#linklogin").addEventListener("click", e =>{
    e.preventDefault();
    loginForm.classList.remove("form-hidden");
    createAccountForm.classList.add("form-hidden");
                                                          
});


// Action to be performed when user clicks on "Send" button within Main Page of Discord
document.getElementById("send-btn").onclick = function(){

    messageID = messageID + 1;
    let msgRef = rtdb.child(chatRef, String(messageID));

    let messageIDObj = {
        "id": messageID,
        "username": String(username),
        "message" : document.getElementById("message-field").value,
        "edited": false
    }

    rtdb.update(msgRef, messageIDObj);

    rtdb.onValue(msgRef, ss=>{
        alert(JSON.stringify(ss.val()));
    });

    let chats = document.getElementById("chats");
    let message = document.createElement("div");
    let editMessage = document.createElement("div");
    let lineBreak = document.createElement("br");
    
    message.className = "msg";
    message.innerHTML = messageIDObj.message;

    let textBox = document.createElement("input");
    textBox.type = "text";
    textBox.id = "edit-field-id-" + String(messageIDObj.id);
    textBox.placeholder = "Edit Your Message";

    let sendBtn = document.createElement("input");
    sendBtn.type = "button";
    sendBtn.id = "send-edit-btn-id-" + String(messageIDObj.id);
    sendBtn.value = "Send Your Edit";

    editMessage.appendChild(textBox);
    editMessage.appendChild(sendBtn);

    editMessage.style = "display: none";
    message.onclick = function(){

        editMessage.style = "display: block";
        document.getElementById("send-edit-btn-id-" + String(messageIDObj.id)).onclick = function(){
            messageIDObj.edited = true;
            message.innerHTML = document.getElementById("edit-field-id-" + String(messageIDObj.id)).value + " (Edited)";
            messageIDObj.message = document.getElementById("edit-field-id-" + String(messageIDObj.id)).value; 
            rtdb.update(msgRef, messageIDObj);

            editMessage.style = "display: none";
        }
    };
    chats.appendChild(message);
    chats.appendChild(editMessage);
    chats.appendChild(lineBreak);
}
