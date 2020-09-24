# Know Me
Chatting web application where you can randomly connect with others and start chatting with them.

## Live Demo (still on progress)

[click here to visit the app](https://know-me-chat.netlify.app/)

## Prototype 
[click here to see the app prototype](https://www.figma.com/proto/iO3Ji7jc7jjMbunV0e3fsl/Random-Chat-App?node-id=48%3A0&scaling=min-zoom)

## Installation Guide
- clone the repo
- install dependancies: `npm install`
- firebase config:
   1. Create a new Firebase project in the [Firebase console.](https://console.firebase.google.com/).
   2. In the console under Authentiction, enable sign-ins with email/password and Google auth.
   3. In the console, create a realtime database.
   4. In the console, enable firebase storage.
   5. In your terminal,  install firbase CLI to deploy cloud function and database rules: `npm install -g firebase-tools` 
      - Log into Firebase using your Google account: `firebase login`
      - Run `firebase init` to initialize the project space. Be sure to select each option (Database, Functions, Storage) when prompted, then select the project you just created in the console. Take all the subsequent defaults when prompted. Don't forget to answer with yes when asked: ` Do you want to install dependencies with npm now?` 
      - Run `firebase deploy` to deploy the web content, Cloud Functions, and database security rules.
   6. Create a .env file in the project root folder and add the following.
      - `SKIP_PREFLIGHT_CHECK=true`
      - these are your Firebase project config, you can get them from your Firebase project settigns
        ```js
        REACT_APP_API_KEY=apiKey
        REACT_APP_AUTH_DOMAIN=authDomain
        REACT_APP_DATABASE_URL=databaseURL
        REACT_APP_PROJECT_ID=projectId
        REACT_APP_STORAGE_BUCKET=storageBucket
        REACT_APP_MESSAGING_SENDER_ID=messagingSenderId
        REACT_APP_APP_ID=appId
        REACT_APP_MEASUREMENT_ID=measurementId
        ```
   7. You can now run the application: `npm start`     
      
## User Stories

As a user, I can:
  - Sign up with email/password or my google account to create an account for me.
  - Sign in with my account to use the features of the app and connect with others
  - Randomly connect with others to start a chat with them for only half an hour.
  - Send a friendship request to those I randomly connect with.
  - Reconnect with those I randomly connect with if and only if I send them a friendship request and they accept it.
  - Search for users via thier email and check their profile to send them a friendship request.
  - Start a chat with my friends to send and receive messages from them and see old messages between us.
  - Delete only the messages that I sent to cancel what I've sent.
  - Edit a message that I sent to change it or fix it (typo...etc).
  - Close a chat with a friend so that it won’t be displayed at my chats list anymore.
  - Navigate to my profile to edit my profile picture, email or reset my password.
  - Sign out from the app to be in offline status.
  - Use a navigation bar to navigate throug the app.
## Technologies
 - React(hooks)
 - Redux
 - React Router
 - TailwindCSS
 - Firebase Auth
 - Firebase Realtime Database
 - Firebase cloud functions
