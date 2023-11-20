// Importing all necessary functions
import { initializeApp,deleteApp,getApp,getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail, updatePassword } from "firebase/auth";
import { getFirestore, orderBy, limit, writeBatch, collection, addDoc, onSnapshot, deleteDoc, arrayUnion, arrayRemove, setDoc, updateDoc, getDocs, doc, serverTimestamp, getDoc, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from 'firebase/storage';

// FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyAqsRsKmkF9UW8s8YL1-m5Nz-igk9q-UjE",
  authDomain: "healthlink5.firebaseapp.com",
  projectId: "healthlink5",
  storageBucket: "healthlink5.appspot.com",
  messagingSenderId: "371626745859",
  appId: "1:371626745859:web:0f9537acac578e9a76ae36"
};

// Initialize Firebase
let firebaseApp
if (!getApps().length){
    firebaseApp = initializeApp(firebaseConfig);
}else{
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig);
}

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

