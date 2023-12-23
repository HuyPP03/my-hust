import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNDAYCZCuYBohxTQGTwhOL62lmi0b1HkM",
  authDomain: "avatar-fdb35.firebaseapp.com",
  projectId: "avatar-fdb35",
  storageBucket: "avatar-fdb35.appspot.com",
  messagingSenderId: "23611696604",
  appId: "1:23611696604:web:6fec6697e713f5828d1b19",
  measurementId: "G-E368KJQFFN",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
