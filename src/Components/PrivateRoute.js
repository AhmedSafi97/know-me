import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { selectCurrentUser } from '../features/currentUserSlice';
import { contactsListener, requestsListener } from '../utils';
import Spinner from './Spinner';
import { CompleteProfile } from '../Pages';

const PrivateRoute = ({ children, path }) => {
  const dispatch = useDispatch();

  const { auth, profileCompleted } = useSelector(selectCurrentUser);

  useEffect(() => {
    if (auth === true) {
      contactsListener(dispatch);
      requestsListener(dispatch);
    }
  }, [auth, dispatch]);

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
