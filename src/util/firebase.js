import firebase from 'firebase/app';
import firebaseConfig from './firebase-credentials.json';

import 'firebase/auth';

firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();

export { auth };
