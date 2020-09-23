import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/storage';

import config from './config';

export const firebase = app.initializeApp(config);

export const googleProvider = new app.auth.GoogleAuthProvider();
export const emailProvider = app.auth.EmailAuthProvider;

export const auth = firebase.auth();
export const db = firebase.database();
export const functions = firebase.functions();
export const storage = firebase.storage();
