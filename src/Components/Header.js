import React from 'react';

import { ReactComponent as Logo } from '../assets/logo.svg';

const Header = () => (
  <div className="bg-blue p-4 md:px-16 xl:px-32">
    <Logo />
  </div>
);

export default Header;
