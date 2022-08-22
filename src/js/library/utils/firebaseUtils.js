import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';

// import configHml from 'config/config-hml.json';
// export const configJson = configHml;

import configPrd from 'config/config-prd.json';
export const configJson = configPrd;

//export const configJson = process.env.NODE_ENV === 'development' ? configHml : configPrd;

//mapfre
export const apiModeEnv = process.env.NODE_ENV === 'development' ? 'HML' : 'PRD';

const config = {
    apiKey: configJson.FIREBASE_APIKEY,
    authDomain: configJson.FIREBASE_AUTHDOMAIN,
    databaseURL: configJson.FIREBASE_DATABASEURL,
    projectId: configJson.FIREBASE_PROJECTID,
    storageBucket: configJson.FIREBASE_STORAGEBUCKET,
    messagingSenderId: configJson.FIREBASE_MESSAGINGSENDERID
};

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();
export const firebaseStorage = firebase.storage();
export const firebaseAuth = firebase.auth();