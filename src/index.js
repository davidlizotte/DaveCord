import {auth, fbauth, serverRef, appusersRef, rtdb} from './firebase-connection.js';

let username;
let userEmail;
let user;
let userUID;
let signUpForm = false; // Flag to check whether or not we are in Sign Up page
let loginForm = true; // Flag to check whether or not we are in Login page
let passwordResetPage = false; // Flag to check whether or not we are in Password Reset page
let mainPage = false;
let serverPage = false;
let appuserID = 0;

rtdb.get(appusersRef).then(ss=>{
    ss.forEach(appuser=>{
        appuserID = appuserID + 1;
    });
});

let kickMemberAction = function(serverName, username, useremail){
    // 1. Kick out the given user from given server
       // - Delete entry of that user from "members" list in database
    // 2. It would be still possible for that user to re-join the given server
};

let banMemberAction = function(serverName, username, useremail){
    // 1. Kick out the given user from given server
       // - Delete entry of that user from "members" list in database
    // 2. Unlike "Kick Member", user in this case won't be able to see or join that server again
};

let makeAdminAction = function(serverName, username, useremail){
    // 1. Set "admin" role to be true for the given user in database
        let serverNameRef = rtdb.child(serverRef, serverName);
        rtdb.get(serverRef).then(ss=>{
            ss.forEach(server=>{
                if(server.val()["name"] == serverName){ 
                    server.val()["members"].forEach(member=>{
                        if(member["username"] == username && member["email"] == useremail){
                           let memberRef = rtdb.child(serverNameRef, member);
                           let roleObj ={
                               "role": {
                                 "admin": true
                               }
                           };
                            rtdb.update(memberRef,roleObj);
                            rtdb.update(serverNameRef, memberRef);
                            
                            let currAdmins = server.val()["admins"];

                            let currAdminObj = {
                                "role": {
                                    "admin": true
                                },
                                "userID": userUID,
                                "username": username,
                                "email": useremail
                            }
                    
                            currAdmins.push(currAdminObj);
                    
                            let adminsObj = {
                                "admins": currAdmins
                            }
                    
                            rtdb.update(serverNameRef, adminsObj); 

                        }
                    });
                }
            });
        });
                              
};

let renderServerPage = function(serverName, username, useremail, isAdmin){

    let isCurrentMemberAdmin = false;

    // Color up the server page before routing there
    rtdb.get(serverRef).then(ss=>{
        ss.forEach(s=>{
            if(s.val()["name"] == serverName){
                let nameContainer = document.getElementById("nameOfServer");
                nameContainer.innerHTML = "";

                let name = document.createElement("div");
                name.innerHTML = s.val()["name"];
                name.style = "color: yellow; text-align: center";
                nameContainer.appendChild(name);

                let membersList = document.getElementById("membersList");
                membersList.innerHTML = "";

                s.val()["members"].forEach(member=>{
                    let currMember = document.createElement("div");
                    currMember.innerHTML = member["username"];

                    if(member["username"] == username && member["email"] == useremail){
                        currMember.style = "color: yellow; text-align: center";
                    }
                    else{
                        if(isAdmin){
                            if(member["role"]["admin"]){
                                isCurrentMemberAdmin = true;
                            }        
                            currMember.style = "color: yellow; text-align: center; cursor: pointer";
                            currMember.onclick = function(){
                                document.getElementById("messagebar").style = "display: none";
                                document.getElementById("user-settings").style = "display: block";

                                if(isCurrentMemberAdmin){
                                    document.getElementById("roles-container").innerHTML = "<br> Admin <br> Member";
                                    isCurrentMemberAdmin = false;
                                }
                                else{
                                    document.getElementById("roles-container").innerHTML = "<br> Member";
                                }

                                document.getElementById("roles-tab").onclick = function() {
                                    document.getElementById("roles-tab").style = "color: grey; text-decoration: underline; cursor: pointer";
                                    document.getElementById("permissions-tab").style = "color: grey; text-decoration: none; cursor: pointer";
                                    if(isCurrentMemberAdmin){
                                        document.getElementById("roles-container").innerHTML = "<br> Admin <br> Member";
                                        isCurrentMemberAdmin = false;
                                    }
                                    else{
                                        document.getElementById("roles-container").innerHTML = "<br> Member";
                                    }
    
                                    document.getElementById("roles-container").style = "display: block";
                                    document.getElementById("permissions-container").style = "display: none";
                                };
                                
                                document.getElementById("permissions-tab").onclick = function() {
                                    document.getElementById("permissions-tab").style = "color: grey; text-decoration: underline; cursor: pointer";
                                    document.getElementById("roles-tab").style = "color: grey; text-decoration: none; cursor: pointer";
                                    document.getElementById("roles-container").style = "display: none";
                                    document.getElementById("permissions-container").style = "display: block";
                                };
                                
                            
                                document.getElementById("submit-changes-btn").onclick = function(){
                                    let kickMember = false;
                                    let banMember = false;
                                    let makeAdmin = false;
                               
                                    /*
                                        Check from HTML forms what actions admin has taken for a particular user
                                        Change the value of above boolean variables as needed
                                    */

                                    if(document.getElementById("kickUserCheckbox").checked){
                                        kickMember = true;
                                    }

                                    if(document.getElementById("banUserCheckbox").checked){
                                        banMember = true;
                                    }
                                    
                                    if(document.getElementById("makeAdminCheckbox").checked){
                                        makeAdmin = true;
                                    }
                               
                               
                                    // 1. Call kickMemberAction(...), banMemberAction(...), and makeAdminAction(...) as appropriate 
                                    if(kickMember){
                                        kickMemberAction(serverName, username, useremail);
                                    }
                                
                                    if(banMember){
                                        banMemberAction(serverName, username, useremail);
                                    }
                                
                                    if(makeAdmin){
                                        makeAdminAction(serverName, username, useremail);
                                    }

                                    // 2. Close the "User Settings" Form
                                    document.getElementById("user-settings").style.display = "none";
                                    document.getElementById("kickUserCheckbox").checked = false;
                                    document.getElementById("banUserCheckbox").checked = false;
                                    document.getElementById("makeAdminCheckbox").checked = false;
                                    document.getElementById("messagebar").style = "display: block";
                                
                                }
                              
                                
                                document.getElementById("close-btn").onclick = function(){
                                    document.getElementById("user-settings").style.display = "none";
                                    document.getElementById("messagebar").style = "display: block";
                                    document.getElementById("roles-tab").style = "color: grey; text-decoration: underline; cursor: pointer";
                                    document.getElementById("permissions-tab").style = "color: grey; text-decoration: none; cursor: pointer";
                                    document.getElementById("roles-container").style = "display: block";
                                    document.getElementById("permissions-container").style = "display: none";
                                }
                                
                            }
                        }
                        else{
                            currMember.style = "color: yellow; text-align: center";
                        }
                    }
                    membersList.appendChild(currMember);
                });

                let adminContainer = document.getElementById("adminName");
                adminContainer.innerHTML = "";

                s.val()["admins"].forEach(admin=>{
                    let adminName = document.createElement("div");
                    adminName.innerHTML = admin["username"];
                    adminName.style = "color: yellow; text-align: center";
                    adminContainer.appendChild(adminName);
                });
            }
        })
    });
}

let serverClickHandler = function(name, username, useremail){
    let serverList = document.getElementById("serverlist");
    let servernameRef = rtdb.child(serverRef, name);
    let messageRef = rtdb.child(servernameRef, "chats");
    let messagegroupRef = rtdb.child(messageRef, "message");
    let userExists = false;
    let isAdmin = false;

    // Display "Delete Server" button if the user who clicked the server link is an admin
    // Also, add the user to "members" list of the given server, upon clicking "Join Server" button, if he/she is not already there
    rtdb.get(serverRef).then(ss=>{
        ss.forEach(server=>{
            if(server.val()["name"] == name){
                server.val()["members"].forEach(member=>{
                    if(member["username"] == username && member["email"] == useremail){
                        userExists = true;

                        if(member["role"]["admin"]){
                            isAdmin = true;
                            document.getElementById("delete-server-btn-container").style = "display: block";
                            document.getElementById("messagebar").style = "display: block";

                            document.getElementById("delete-server-btn").onclick = function(){
                                let serverNameRef = rtdb.child(serverRef, name);
                                rtdb.set(serverNameRef, null);

                                loginForm = false;
                                signUpForm = false;
                                passwordResetPage = false;
                                mainPage = true;
                                serverPage = false;
                            
                                document.getElementById("nameOfServer").innerHTML = "";
                                document.getElementById("membersList").innerHTML = "";
                                document.getElementById("adminName").innerHTML = "";
                                document.getElementById("leave-server-btn-container").style = "display: none";
                                document.getElementById("join-server-btn-container").style = "display: none";
                                document.getElementById("delete-server-btn-container").style = "display: none";
                            
                                location.href = "#main_page"
                                window.addEventListener("hashchange", handleHash);
                                window.addEventListener("load", handleHash);
                                
                            }
                        }
                        else{
                            document.getElementById("leave-server-btn-container").style = "display: block";
                            document.getElementById("messagebar").style = "display: block";
                        }
                    }
                });

                if(!userExists){
                    document.getElementById("join-server-btn-container").style = "display: block";
                    document.getElementById("messagebar").style = "display: none";

                    document.getElementById("join-server-btn").onclick = function(){
                        document.getElementById("join-server-btn-container").style = "display: none";
                        document.getElementById("leave-server-btn-container").style = "display: block";
                        document.getElementById("messagebar").style = "display: block";

                        let serverNameRef = rtdb.child(serverRef, name);
                        let currMembers = server.val()["members"];

                        let currMemberObj = {
                            "role": {
                                "admin": false
                            },
                            "userID": userUID,
                            "username": username,
                            "email": useremail
                        }
                    
                        currMembers.push(currMemberObj);
                    
                        let membersObj = {
                            "members": currMembers
                        }
                    
                        rtdb.update(serverNameRef, membersObj);
                        renderServerPage(name, username, useremail, isAdmin);

                        document.getElementById("leave-server-btn").onclick = function(){
                            document.getElementById("join-server-btn-container").style = "display: block";
                            document.getElementById("leave-server-btn-container").style = "display: none";
                            document.getElementById("messagebar").style = "display: none";
                            let index = 0;
                            let serverNameRef = rtdb.child(serverRef, name);
                            let currMembers = server.val()["members"];

                            currMembers.forEach(member=>{
                                if(member["username"] == username && member["email"] == useremail){
                                    currMembers.splice(index, 1);
                                }
                                else{
                                    index = index + 1;
                                }
                            });

                            let membersObj = {
                                "members": currMembers
                            }

                            rtdb.update(serverNameRef, membersObj);
                            renderServerPage(name, username, useremail, isAdmin);
                        }
                    };
                    
                }
                
                renderServerPage(name, username, useremail, isAdmin);
            }
        });
    });

    document.getElementById("send-btn").onclick = function(){
        let message = document.getElementById("message-field").value;
        document.getElementById("message-field").value="";
        const currenttime = new Date();

        let chatObj = { 
            "message": message,
            "timestamp": currenttime.toUTCString(),
            "username": username
        };
             
        rtdb.push(messagegroupRef, chatObj);
    }
                                
                               
    
    rtdb.onValue(messagegroupRef ,ss => {
        let allMessages = ss.val();
        let listOfMessages = document.getElementById("PastMessages");
        listOfMessages.innerHTML = ''; 
        
        for (const message in allMessages) {
            let displayuser = document.createElement('div');
            displayuser.innerHTML = "<span style='font-size:14px;font-weight: bold'>" + allMessages[message].username + "</span> &nbsp; <span style='font-size:14px; color: grey'>" + allMessages[message].timestamp + "</span>";
            let displayedMessage = document.createElement('ul');

            if(allMessages[message].username == username){ 
                let displayedMessage = document.createElement('ul');
                displayedMessage.setAttribute("class", "personalmessage");
       
            }else{
                let displayedMessage = document.createElement('ul');
                displayedMessage.setAttribute("class", "personalmessage");
            }

            listOfMessages.appendChild(displayuser);
            listOfMessages.appendChild(displayedMessage);
            displayedMessage.innerText = allMessages[message].message;
            displayedMessage.style = "font-size: 14px";
        }
    });

    loginForm = false;
    signUpForm = false;
    passwordResetPage = false;
    mainPage = false;
    serverPage = true;

    // Route to the server page
    location.href = "#serverPage"
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("load", handleHash);
    
    serverList.innerHTML = "";
}

let displayServers = function(){
    let serverList = document.getElementById("serverlist");

    // Read servers from the database, if any, and store it in the sidepanel container for list of servers
    rtdb.get(serverRef).then(ss=>{
        ss.forEach(server => {
            let currServer = document.createElement("div");
            let serverName = server.val()["name"];

            currServer.innerHTML = serverName;
            currServer.style = "color: yellow; text-align: center; cursor: pointer";
            currServer.id = serverName;
            currServer.onclick = function(){
                serverClickHandler(currServer.id, username, userEmail);
            }

            serverList.appendChild(currServer);
       });
    });
}

let handleHash = function(){
    if(signUpForm == true){
        document.getElementById("login").style = "display: none";
        document.getElementById("signup").style = "display: block";
        document.getElementById("main_page").style = "display: none";
        document.getElementById("password-reset").style = "display: none";
        document.getElementById("serverPage").style = "display: none";
    }
    if(loginForm == true){
        document.getElementById("signup").style = "display: none";
        document.getElementById("login").style = "display: block";
        document.getElementById("main_page").style = "display: none";
        document.getElementById("password-reset").style = "display: none";
        document.getElementById("serverPage").style = "display: none";
    }
    if(passwordResetPage == true){
        let email = document.getElementById("signin-email").value;

        document.getElementById("signup").style = "display: none";
        document.getElementById("login").style = "display: none";
        document.getElementById("main_page").style = "display: none";
        document.getElementById("password-reset").style = "display: block";
        document.getElementById("serverPage").style = "display: none";

        fbauth.sendPasswordResetEmail(auth, email).then(() => {
            // Password reset email sent!
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode);
        });
    }
    if(mainPage == true){
        document.getElementById("signup").style = "display: none";
        document.getElementById("login").style = "display: none";
        document.getElementById("main_page").style = "display: block";
        document.getElementById("password-reset").style = "display: none";
        document.getElementById("serverPage").style = "display: none";
        document.getElementById("container").style = "display: block";

        displayServers();
    }

    if(serverPage == true){
        document.getElementById("signup").style = "display: none";
        document.getElementById("login").style = "display: none";
        document.getElementById("main_page").style = "display: none";
        document.getElementById("password-reset").style = "display: none";
        document.getElementById("serverPage").style = "display: block";
        document.getElementById("container").style = "display: none";
    }
};

document.getElementById("login-link").onclick = function(){
    loginForm = true;
    signUpForm = false;
    passwordResetPage = false;
    mainPage = false;
    serverPage = false;
    document.getElementById("signupChecker").innerText = "";
    document.getElementById("user-email").value = "";
    document.getElementById("user-username").value = "";
    document.getElementById("user-password").value = "";
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("load", handleHash);
};

document.getElementById("password-reset-login-link").onclick = function() {
    loginForm = true;
    signUpForm = false;
    passwordResetPage = false;
    mainPage = false;
    serverPage = false;
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("load", handleHash);
    document.getElementById("signin-email").value = "";
    document.getElementById("signin-password").value = "";
};

document.getElementById("signup-link").onclick = function(){
    loginForm = false;
    signUpForm = true;
    passwordResetPage = false;
    mainPage = false;
    serverPage = false;
    document.getElementById("signin-email").value = "";
    document.getElementById("signin-password").value = "";
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("load", handleHash);
};
/* Action to be performed when user clicks "Sign Up" button */
document.getElementById("signup-btn").onclick = function(e){
    let email = document.getElementById("user-email").value;
    let password = document.getElementById("user-password").value;

    fbauth.createUserWithEmailAndPassword(auth, email, password).then(()=>{
        document.getElementById("signupChecker").innerText = "SIGNUP SUCCESSFUL!!!";
        username = document.getElementById("user-username").value;

        // Write username and email upon signup to the firebase to retrieve user information on fly
        let appuserIDRef = rtdb.child(appusersRef, String(appuserID));
        appuserID = appuserID + 1;
        let userObj = {
            "email": String(email),
            "username": String(username)
        };
        rtdb.update(appuserIDRef, userObj);

    }).catch(e=>{
        document.getElementById("signupChecker").innerText = "";
        alert(e.code);
    });
};

/* Action to be performed when user clicks "Login" button */
document.getElementById("login-btn").onclick = function(){
    let email = document.getElementById("signin-email").value;
    let password = document.getElementById("signin-password").value;

    fbauth.signInWithEmailAndPassword(auth, email, password).then(()=>{
        loginForm = false;
        signUpForm = false;
        passwordResetPage = false;
        mainPage = true;
        serverPage = false;
        user = auth.currentUser;       
        userUID = user.uid;
        let emailStr = String(email);

        // Read username from the database and store it in a variable for later use
        rtdb.get(appusersRef).then(ss=>{
            ss.forEach(appuser=>{
                if(appuser.val()["email"] == emailStr){
                    username = appuser.val()["username"];
                    userEmail = emailStr;
                }
            });
        });

        location.href = "#main_page";
        window.addEventListener("hashchange", handleHash);
        window.addEventListener("load", handleHash);
    }).catch(e=>{
        alert(e.code);
    })
        
};

document.getElementById("password-reset-link").onclick = function(){
    passwordResetPage = true;
    signUpForm = false;
    loginForm = false;
    mainPage = false;
    serverPage = false;
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("load", handleHash);
};

document.getElementById("addserver-btn").onclick = function(){
    document.getElementById("create-server").style.display = "block";
}

document.getElementById("cancel-btn").onclick = function(){
    document.getElementById("create-server").style.display = "none";
}

document.getElementById("create-server-btn").onclick = function(){
    let serverList = document.getElementById("serverlist");
    let server = document.createElement("div");
    let serverName = String(document.getElementById("server-name").value);

    server.innerHTML = serverName;
    server.style = "color: yellow; text-align: center; cursor: pointer";
    server.id = serverName;
    server.onclick = function(){
        serverClickHandler(server.id, username, userEmail);
    }
    serverList.appendChild(server);

    document.getElementById("create-server").style.display = "none";
    document.getElementById("server-name").value = "";

    let nameRef = rtdb.child(serverRef, serverName);
    let userObj = {
        "role": {
            "admin": true
        },
        "userID": userUID,
        "username": username,
        "email": userEmail
    }

    let serverObj = {
        "name": serverName,
        "chats": [],
        "members": [
            userObj
        ],
        "admins": [
            userObj
        ],
        "createdBy" : userObj,
        "serverID" : userObj.userID
    };

    rtdb.update(nameRef, serverObj);
}

document.getElementById("back-btn").onclick = function(){
    loginForm = false;
    signUpForm = false;
    passwordResetPage = false;
    mainPage = true;
    serverPage = false;

    document.getElementById("nameOfServer").innerHTML = "";
    document.getElementById("membersList").innerHTML = "";
    document.getElementById("adminName").innerHTML = "";
    document.getElementById("leave-server-btn-container").style = "display: none";
    document.getElementById("join-server-btn-container").style = "display: none";
    document.getElementById("delete-server-btn-container").style = "display: none";

    location.href = "#main_page"
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("load", handleHash);
}

document.getElementById("logout-btn").onclick = function(){

    fbauth.signOut(auth).then(() => {
        // Sign-out successful.
        loginForm = true;
        signUpForm = false;
        passwordResetPage = false;
        mainPage = false;
        serverPage = false;

        location.href= "#login"
        window.addEventListener("hashchange", handleHash);
        window.addEventListener("load", handleHash);

        document.getElementById("signin-email").value = "";
        document.getElementById("signin-password").value = "";

        let serverList = document.getElementById("serverlist");
        serverList.innerHTML = "";
      }).catch((e) => {
        // An error happened.
        alert(e);
      });      
}
