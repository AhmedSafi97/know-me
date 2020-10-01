import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';

import { imageLoader } from '../utils';
import Header from './Header';
import Spinner from './Spinner';
import bg from '../assets/bg.jpg';

const PublicLayout = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    imageLoader(bg, () => setLoaded(true));
  }, []);

  if (!loaded) return <Spinner />;

  return (
    <div
      className="h-screen bg-cover bg-center bg-clip-border"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Header />
      <div className="p-4 md:px-16 xl:px-32">{children}</div>
    </div>
  );
};

PublicLayout.propTypes = {
  children: propTypes.node.isRequired,
};

export default PublicLayout;
