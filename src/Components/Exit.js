import React from 'react';
import propTypes from 'prop-types';

import { ReactComponent as ExitIcon } from '../assets/exit.svg';

const Exist = ({ onClick }) => (
  <button type="button" aria-label="exit" onClick={onClick}>
    <ExitIcon />
  </button>
);

Exist.propTypes = {
  onClick: propTypes.func.isRequired,
};

export default Exist;
