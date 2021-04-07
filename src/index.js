import './sass/main.scss';
import './js/teamLightbox';
import './js/galleryRender';
import './js/switch-theme/switch-theme';
import { addBackToTop } from 'vanilla-back-to-top';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';
import 'firebase/firebase-storage';

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAtIJUaWZD20pz7Ux0LDeYEoDbnWYToAwI",
    authDomain: "teemsokil.firebaseapp.com",
    databaseURL: "https://teemsokil-default-rtdb.firebaseio.com",
    projectId: "teemsokil",
    storageBucket: "teemsokil.appspot.com",
    messagingSenderId: "962277351443",
    appId: "1:962277351443:web:d1a4d44b87ba5784c81fe6",
    measurementId: "G-M5X7PRVFCY"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

var firebase = require('firebase');
var firebaseui = require('firebaseui');
addBackToTop();
