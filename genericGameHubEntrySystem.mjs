
//WARNING:
// Don't touch this. Seriously, don't. If you touch this, you risk crashing my game hub. So please, DON'T TOUCH THIS CODE.

// In order to activate this script, please go to the end of the script, uncomment the last line of code and write your game's database ID into the brackets. I'll tell you your game's database ID once I've set your game's databse entry up.

console.log("GENERIC GAME HUB ENTRY HANDLER (v1)");

import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { ref, get, set} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

const dataconf = {
    apiKey: "AIzaSyCeZXZgoV9Mpij9e9dstha_5NpFfOh7-TQ",
    authDomain: "comp-2025-joshua-k-h-project.firebaseapp.com",
    databaseURL: "https://comp-2025-joshua-k-h-project-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "comp-2025-joshua-k-h-project",
    storageBucket: "comp-2025-joshua-k-h-project.firebasestorage.app",
    messagingSenderId: "800633378514",
    appId: "1:800633378514:web:3d6f86c8cafba693e1ff0b",
    measurementId: "G-7BEB4GJQV0"
};

const app = initializeApp(dataconf);
const database = getDatabase(app);

function randomInteger(digits) {
    return Math.floor(Math.random()*(10**digits))
}

class gghEntryHandler {
    constructor(gameID) {
        this.user = null;
        this.username = null;
        this.gameID = gameID;
        console.log("GENERIC GAME HUB ENTRY HANDLER INITIALISED: gameID = "+this.gameID);
    }

    logout() {
        const AUTH = getAuth();
        signOut(AUTH).then(() => {
            this.user = null;
            console.log("GENERIC GAME HUB ENTRY HANDLER: Logout successful.");
        }).catch((error) => {
            console.warn("GENERIC GAME HUB ENTRY HANDLER: LOGOUT ERROR: " + error.code + " - " + error.message);
        });
    }

    login(useGoogle, email, password) {
        /**
         * 
         * @param {bool} useGoogle Whether or not the login should be performed through google.
         * @param {string} email The email to pass to the authentication system. Only necessary if useGoogle is false.
         * @param {string} password The password to pass to the authentication system. Only necessary if useGoogle is false.
         */
        const AUTH = getAuth();
        if (useGoogle) {
            const PROVIDER = new GoogleAuthProvider();
            PROVIDER.setCustomParameters({
                prompt: 'select_account'
            });

            signInWithPopup(AUTH, PROVIDER).then((result) => {
                console.log("GENERIC GAME HUB ENTRY HANDLER: AUTHENTICATION SUCCESS - Logged in as user \"" + result.user.displayName + "\"")
                this.user = result.user;
                const reference = ref(database, `/userData/${this.user.uid}/username`);
                get(reference).then((snapshot) => {
                    var fb_data = snapshot.val();
                    if (fb_data != null) {
                        this.username = fb_data;
                    } else {
                        console.warn("GENERIC GAME HUB ENTRY HANDLER - ALERT: You do not have a username! You must complete the sign up process before logging into any games!");
                        this.logout();
                    }
                }).catch((error) => {
                    console.warn(error.code + " - " + error.message);
                    if (error.message = "Permission denied.") {
                        console.warn("GENERIC GAME HUB ENTRY HANDLER - AUTHENTICATION ERROR: For some reason, read permission was denied. Because of this, you have not been logged in. You might want to talk to me about this.");
                        this.logout();
                    } else {
                        console.warn(error.code + " - " + error.message);
                    }
                });
            })
            .catch((error) => {
                console.warn("GENERIC GAME HUB ENTRY HANDLER: AUTHENTICATION ERROR: " + error.code + " - " + error.message)
            });
        } else {
            signInWithEmailAndPassword(AUTH, email, password)
            .then((userCredential) => {
                // Signed in 
                console.log("GENERIC GAME HUB ENTRY HANDLER: AUTHENTICATION SUCCESS - Logged in as user \"" + userCredential.user.email + "\"")
                this.user = userCredential.user;
                const reference = ref(database, `/userData/${this.user.uid}/username`);
                get(reference).then((snapshot) => {
                    var fb_data = snapshot.val();
                    if (fb_data != null) {
                        this.username = fb_data;
                    } else {
                        console.warn("GENERIC GAME HUB ENTRY HANDLER - ALERT: You do not have a username! You must complete the sign up process before logging into any games!");
                        this.logout();
                    }
                }).catch((error) => {
                    console.warn(error.code + " - " + error.message);
                    if (error.message = "Permission denied.") {
                        console.warn("GENERIC GAME HUB ENTRY HANDLER - AUTHENTICATION ERROR: For some reason, read permission was denied. Because of this, you have not been logged in. This is my fault - you might want to talk to me about this.");
                        this.logout();
                    } else {
                        console.warn(error.code + " - " + error.message);
                    }
                });
            })
            .catch((error) => {
                console.warn("GENERIC GAME HUB ENTRY HANDLER: AUTHENTICATION ERROR: " + error.code + " - " + error.message)
            });
        }
    }

    async authenticateRecord(recordToAuthenticate, nextFunction) {
        var verdict = false;
        const reference = ref(database, `/games/${this.gameID}/recordEntries`)
        get(reference).then((snapshot) => {
            var associatedEntries = Object.values(snapshot.val());
            console.log(associatedEntries);
            var i = 0;
            for (i=0;i<associatedEntries.length;i++) {
                if (associatedEntries[i].id == recordToAuthenticate) {
                    console.log("Verification system has allowed proposed edit.")
                    verdict = true;
                }
                nextFunction(verdict);
            }
        }).catch((error) => {
            console.warn("GENERIC GAME HUB ENTRY HANDLER - VERIFICATION ALERT: " + error.code + " - " + error.message);
            verdict = false;
            nextFunction(verdict);
        })
    }

    recordEntry(recordToAlter, scoreToEnter) {
        if (this.user != null) {
            this.authenticateRecord(recordToAlter, (authVerdict) => {
                console.log(authVerdict);
            if (authVerdict) {
                    const reference = ref(database, `/records/${recordToAlter}/entry${randomInteger(20)}`);
                    set(reference, {user:this.username, score:scoreToEnter}).then(() => {
                    console.log("GENERIC GAME HUB ENTRY HANDLER: Entry saved.")
                }).catch((error) => {
                    if (error.message = "Permission denied.") {
                        console.warn("GENERIC GAME HUB ENTRY HANDLER - ALERT: For some reason, write permission was denied. This is my fault - you might want to talk to me about this.")
                    } else {
                        console.warn("GENERIC GAME HUB ENTRY HANDLER - ALERT: " + error.code + " - " + error.message);
                    }
                });
            } else {
                console.warn("LINE 1 - GENERIC GAME HUB ENTRY HANDLER - WARNING: この狂気を止めろ！ You are not allowed to alter another game's records!");
                console.warn("LINE 2 - Either the authentication system failed or you attempted to alter another game's records. Either way, your attempted changes have not been saved. If the former reason is the problem, pretend that the third line of this warning was never written.");
                console.warn("LINE 3 - あなたは邪悪な悪魔です!")
            }
            });
              
        } else {
            console.warn("GENERIC GAME HUB ENTRY HANDLER - ALERT: You are not signed into the Generic Game Hub! Your score has not been recorded.");
        }
    }
}

//Uncomment the line below.
window.gghEntryHandler = new gghEntryHandler("gameThatWorks");
window.gghEntryHandler.login(true);
