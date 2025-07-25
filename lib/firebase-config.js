// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAzuxYrnDEOujT2jztZiLmH5K8kczjci6o",

  authDomain: "athena-8ad1b.firebaseapp.com",

  projectId: "athena-8ad1b",

  storageBucket: "athena-8ad1b.firebasestorage.app",

  messagingSenderId: "530327553262",

  appId: "1:530327553262:web:317e3eb87c4ef1c63ddfff",

  measurementId: "G-MFMVX4M4EK"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth = getAuth(app);