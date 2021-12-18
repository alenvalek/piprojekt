import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import {
   getFirestore,
   setDoc,
   doc,
   deleteDoc,
   getDoc,
   collection,
   addDoc,
   onSnapshot,
   query,
   where,
   updateDoc,
} from 'firebase/firestore';
import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   onAuthStateChanged,
   updateProfile,
   signOut,
   deleteUser,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage();

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
   deleteDoc,
   getDoc,
   addDoc,
   collection,
   deleteUser,
   onSnapshot,
   storage,
   ref,
   uploadBytes,
   getDownloadURL,
   query,
   where,
   updateDoc,
};
