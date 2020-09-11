import React from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../features/currentUserSlice';

const PrivateRoute = ({ children, path }) => {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Route path={path}>{currentUser.id ? children : <Redirect to="/" />}</Route>
  );
};

PrivateRoute.propTypes = {
  children: propTypes.node.isRequired,
  path: propTypes.string.isRequired,
};

export default PrivateRoute;
