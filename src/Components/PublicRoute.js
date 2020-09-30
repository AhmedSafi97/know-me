import React from 'react';
import propTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../features/currentUserSlice';
import PublicLayout from './PublicLayout';
import Spinner from './Spinner';

const PublicRoute = ({ children, path }) => {
  const { auth } = useSelector(selectCurrentUser);

  let renderedComponent;

  if (auth === true) {
    renderedComponent = <Redirect to="/connect" />;
  } else if (auth === false) {
    renderedComponent = <PublicLayout>{children}</PublicLayout>;
  } else {
    renderedComponent = <Spinner />;
  }

  return <Route path={path}>{renderedComponent}</Route>;
};
PublicRoute.propTypes = {
  children: propTypes.node.isRequired,
  path: propTypes.string.isRequired,
};

export default PublicRoute;
