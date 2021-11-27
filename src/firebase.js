import { initializeApp } from 'firebase/app';
import 'firebase/auth';
// import { getStorage } from 'firebase/storage';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   onAuthStateChanged,
   updateProfile,
   signOut,
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: 'AIzaSyCsqSFFGknWuMnwIR6xDzhnRlhLA6ng_ts',
   authDomain: 'pi-project-dev.firebaseapp.com',
   projectId: 'pi-project-dev',
   storageBucket: 'pi-project-dev.appspot.com',
   messagingSenderId: '115546475580',
   appId: '1:115546475580:web:e7601cc79f5be0f6cf8739',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export {
   app,
   db,
   auth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   onAuthStateChanged,
   updateProfile,
   signOut,
   getFirestore,
   setDoc,
   doc,
};
