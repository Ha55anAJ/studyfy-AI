// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "studyfy-ai-f8b1e.firebaseapp.com",
    projectId: "studyfy-ai-f8b1e",
    storageBucket: "studyfy-ai-f8b1e.appspot.com",
    messagingSenderId: "1059489825114",
    appId: "1:1059489825114:web:6b5b48316f3497cf827363"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };