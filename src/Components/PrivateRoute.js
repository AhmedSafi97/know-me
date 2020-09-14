import React from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../features/currentUserSlice';
import Spinner from './Spinner';

const PrivateRoute = ({ children, path }) => {
  const { auth } = useSelector(selectCurrentUser);

  let renderedComponent;

  if (auth === true) {
    renderedComponent = children;
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
