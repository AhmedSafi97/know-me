import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { selectCurrentUser } from '../features/currentUserSlice';
import { fetchContacts } from '../features/contactsSlice';
import { fetchRequests } from '../features/requestsSlice';
import { fetchLastMessages } from '../features/lastMessagesSlice';
import { contactsListener, requestsListener } from '../utils';
import Spinner from './Spinner';
import { CompleteProfile } from '../Pages';

const PrivateRoute = ({ children, path }) => {
  const dispatch = useDispatch();

  const { auth, profileCompleted } = useSelector(selectCurrentUser);
  const contactsStatus = useSelector((state) => state.contacts.status);
  const requestsStatus = useSelector((state) => state.requests.status);
  const lastMessagesStatus = useSelector((state) => state.lastMessages.status);

  useEffect(() => {
    if (auth === true) {
      if (contactsStatus === 'idle') {
        dispatch(fetchContacts());
      } else if (contactsStatus === 'succeeded') {
        contactsListener(dispatch);
      }
    }
  }, [auth, dispatch, contactsStatus]);

  useEffect(() => {
    if (auth === true) {
      if (requestsStatus === 'idle') {
        dispatch(fetchRequests());
      } else if (requestsStatus === 'succeeded') {
        requestsListener(dispatch);
      }
    }
  }, [auth, dispatch, requestsStatus]);

  useEffect(() => {
    if (auth === true) {
      if (lastMessagesStatus === 'idle') {
        dispatch(fetchLastMessages());
      }
    }
  }, [auth, dispatch, lastMessagesStatus]);

  let renderedComponent;

  if (auth === true) {
    renderedComponent = profileCompleted ? children : <CompleteProfile />;
  } else if (auth === false) {
    renderedComponent = <Redirect to="/" />;
  } else {
    renderedComponent = <Spinner />;
  }

  return <Route path={path}>{renderedComponent}</Route>;
};

PrivateRoute.propTypes = {
  children: propTypes.node.isRequired,
  path: propTypes.string.isRequired,
};

export default PrivateRoute;
