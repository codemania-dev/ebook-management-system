import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  databaseURL: process.env.REACT_APP_DATABASE_URL
};

// console.log(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

export default storage;