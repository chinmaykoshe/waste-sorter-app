/* Firebase-ready auth module (email/password). Paste your firebaseConfig below. */


// ======= PASTE YOUR FIREBASE CONFIG ======
const firebaseConfig = {
    apiKey: "AIzaSyBCii5yOSEcmE1JhVbk0jOzwSqnWeNPDAQ",
    authDomain: "chat-app-31ca7.firebaseapp.com",
    projectId: "chat-app-31ca7",
    storageBucket: "chat-app-31ca7.firebasestorage.app",
    messagingSenderId: "1084895323995",
    appId: "1:1084895323995:web:22c88d98772fbf49601c7e",
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// expose simple API
window.Auth = {
signup: async (email, password, displayName) => {
const userCred = await auth.createUserWithEmailAndPassword(email, password);
await userCred.user.updateProfile({displayName});
await saveUserProfile(userCred.user);
return userCred.user;
},
signin: async (email, password) => {
const userCred = await auth.signInWithEmailAndPassword(email, password);
await saveUserProfile(userCred.user);
return userCred.user;
},
signout: async () => await auth.signOut(),
onAuthStateChanged: (cb) => auth.onAuthStateChanged(cb),
getCurrentUser: () => auth.currentUser
};


async function saveUserProfile(user){
if(!user) return;
const usersRef = db.collection('users').doc(user.uid);
await usersRef.set({
uid: user.uid,
name: user.displayName || 'User',
email: user.email || '',
photoURL: user.photoURL || ('https://i.pravatar.cc/100?u='+user.uid),
online: true,
lastSeen: firebase.firestore.FieldValue.serverTimestamp()
}, {merge:true});
}


// update online status on unload
window.addEventListener('beforeunload', async ()=>{
const u = auth.currentUser;
if(u) await db.collection('users').doc(u.uid).set({online:false,lastSeen:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
});


// helper to update lastSeen & online
async function setOnline(uid, online=true){
if(!uid) return;
await db.collection('users').doc(uid).set({online, lastSeen: firebase.firestore.FieldValue.serverTimestamp()}, {merge:true});
}


// expose helper
window.setOnline = setOnline;