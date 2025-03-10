// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth  } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJBziP9HqyWspJ7H4c9xkMEgh0Kc77FFs",
  authDomain: "react-firebase--auth-c199e.firebaseapp.com",
  projectId: "react-firebase--auth-c199e",
  storageBucket: "react-firebase--auth-c199e.appspot.com",
  messagingSenderId: "602155877190",
  appId: "1:602155877190:web:30dc5fed03bc3b832edb47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

export default app;