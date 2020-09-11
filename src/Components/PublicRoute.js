import React from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../features/currentUserSlice';

const PublicRoute = ({ children, path }) => {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <Route path={path}>
      {currentUser.id ? <Redirect to="/connect" /> : children}
    </Route>
  );
};
PublicRoute.propTypes = {
  children: propTypes.node.isRequired,
  path: propTypes.string.isRequired,
};

export default PublicRoute;
