import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();