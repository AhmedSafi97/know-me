import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from '../assets/logo.svg';

const Header = () => (
  <div className="bg-blue p-4 md:px-16 xl:px-32">
    <Link to="/">
      <Logo />
    </Link>
  </div>
);

export default Header;
