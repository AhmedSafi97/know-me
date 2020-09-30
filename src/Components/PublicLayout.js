import React from 'react';
import propTypes from 'prop-types';

import Header from './Header';
import bg from '../assets/bg.jpg';

const PublicLayout = ({ children }) => (
  <div
    className="h-screen bg-cover bg-center bg-clip-border"
    style={{ backgroundImage: `url(${bg})` }}
  >
    <Header />
    <div className="p-4 md:px-16 xl:px-32">{children}</div>
  </div>
);

PublicLayout.propTypes = {
  children: propTypes.node.isRequired,
};

export default PublicLayout;
