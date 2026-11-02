/*==================================================
YETALK FIREBASE.JS
==================================================*/


/*==================================================
FIREBASE APP
==================================================*/

import {

    initializeApp

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


/*==================================================
FIRESTORE
==================================================*/

import {

    getFirestore,

    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,

    collection,
    addDoc,
    getDocs,

    query,
    where,
    orderBy,
    limit,

    serverTimestamp,

    runTransaction,
    increment

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/*==================================================
FIREBASE STORAGE
==================================================*/

import {

    getStorage,

    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";


/*==================================================
FIREBASE CONFIG
==================================================*/

const firebaseConfig = {

    apiKey:
        "AIzaSyD9kRWSeNfGWLft0qaDldyF7pnLGOmtU_c",

    authDomain:
        "yetalk-kr.firebaseapp.com",

    projectId:
        "yetalk-kr",

    storageBucket:
        "yetalk-kr.firebasestorage.app",

    messagingSenderId:
        "1016018270024",

    appId:
        "1:1016018270024:web:ca888bdab48090e457e57d"

};


/*==================================================
INITIALIZE
==================================================*/

const app =
    initializeApp(
        firebaseConfig
    );


const db =
    getFirestore(
        app
    );


const storage =
    getStorage(
        app
    );


/*==================================================
EXPORT
==================================================*/

export {

    app,

    db,

    storage,


    /*==================================================
    FIRESTORE DOCUMENT
    ==================================================*/

    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,


    /*==================================================
    FIRESTORE COLLECTION
    ==================================================*/

    collection,
    addDoc,
    getDocs,


    /*==================================================
    FIRESTORE QUERY
    ==================================================*/

    query,
    where,
    orderBy,
    limit,


    /*==================================================
    FIRESTORE VALUE
    ==================================================*/

    serverTimestamp,
    runTransaction,
    increment,


    /*==================================================
    STORAGE
    ==================================================*/

    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject

};