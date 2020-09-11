import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { PrivateRoute, PublicRoute } from './Components';
import {
  Home,
  Login,
  Signup,
  Connect,
  Chats,
  Messages,
  Contacts,
  Profile,
} from './Pages';
import { auth } from './firebase';
import {
  currentUserAdded,
  currentUserRemoved,
} from './features/currentUserSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(currentUserAdded(user.uid));
      } else {
        dispatch(currentUserRemoved());
      }
    });
  });

  return (
    <Router>
      <Switch>
        <PublicRoute exact path="/">
          <Home />
        </PublicRoute>
        <PublicRoute path="/login">
          <Login />
        </PublicRoute>
        <PublicRoute path="/signup">
          <Signup />
        </PublicRoute>
        <PrivateRoute path="/connect">
          <Connect />
        </PrivateRoute>
        <PrivateRoute path="/chats">
          <Chats />
        </PrivateRoute>
        <PrivateRoute path="/chats/contacts">
          <Contacts />
        </PrivateRoute>
        <PrivateRoute path="/chats/:id">
          <Messages />
        </PrivateRoute>
        <PrivateRoute path="/profile">
          <Profile />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};

export default App;
