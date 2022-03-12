import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAlCbOsze6d7dlEIY57oP8Ko3H3ojq8r7A",
  authDomain: "brute-nft.firebaseapp.com",
  projectId: "brute-nft",
  storageBucket: "brute-nft.appspot.com",
  messagingSenderId: "794178733382",
  appId: "1:794178733382:web:7f602a00d7cb78d8ffd147",
  measurementId: "G-PR9B1ESX67",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
