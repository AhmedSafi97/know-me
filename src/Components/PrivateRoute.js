import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { selectCurrentUser } from '../features/currentUserSlice';
import { fetchContacts, selectContactsIds } from '../features/contactsSlice';
import { fetchRequests, selectRequestsIds } from '../features/requestsSlice';
import { fetchLastMessages } from '../features/lastMessagesSlice';
import { contactsListener, requestsListener } from '../utils';
import Spinner from './Spinner';
import { CompleteProfile } from '../Pages';

const PrivateRoute = ({ children, path }) => {
  const dispatch = useDispatch();

  const { auth, profileCompleted } = useSelector(selectCurrentUser);
  const contactsStatus = useSelector((state) => state.contacts.status);
  const contactsIds = useSelector(selectContactsIds);

  const requestsStatus = useSelector((state) => state.requests.status);
  const requestsIds = useSelector(selectRequestsIds);

  const lastMessagesStatus = useSelector((state) => state.lastMessages.status);

  useEffect(() => {
    if (auth === true) {
      if (contactsStatus === 'idle') {
        dispatch(fetchContacts());
      } else if (contactsStatus === 'succeeded') {
        contactsListener.listen(dispatch, contactsIds);
      }
    }
  }, [auth, dispatch, contactsStatus, contactsIds]);

  useEffect(() => {
    if (auth === true) {
      if (requestsStatus === 'idle') {
        dispatch(fetchRequests());
      } else if (requestsStatus === 'succeeded') {
        requestsListener.listen(dispatch, requestsIds);
      }
    }
  }, [auth, dispatch, requestsStatus, requestsIds]);

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
