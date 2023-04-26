import { initializeApp } from "firebase/app";
import{getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB9mi3BOPhgKyVMo_z_ArgyeCFS7aUUIcI",
  authDomain: "fir-auth-5979c.firebaseapp.com",
  projectId: "fir-auth-5979c",
  storageBucket: "fir-auth-5979c.appspot.com",
  messagingSenderId: "952474520098",
  appId: "1:952474520098:web:59476e3e6d8faf8da9d87b",
  measurementId: "G-N9ZHG7XXMC"
};

//initialise firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export default app;