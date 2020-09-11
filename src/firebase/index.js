import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

import config from './config';

export const firebase = app.initializeApp(config);

export const googleProvider = new app.auth.GoogleAuthProvider();

export const auth = firebase.auth();
export const db = firebase.database();
export const functions = firebase.functions();
