import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA6l40OeXfAK-yDuzCcnR2cPE_o7C4-Uus",
  authDomain: "miniblog-a56b2.firebaseapp.com",
  projectId: "miniblog-a56b2",
  storageBucket: "miniblog-a56b2.appspot.com",
  messagingSenderId: "596631257884",
  appId: "1:596631257884:web:20b1859603d738459270d9"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db};