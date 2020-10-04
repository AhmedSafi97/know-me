import React from 'react';
import propTypes from 'prop-types';

import { ReactComponent as ExitIcon } from '../assets/exit.svg';
import { ReactComponent as WhiteExitIcon } from '../assets/exit-white.svg';

const Exit = ({ onClick, primaryStyle }) => (
  <button type="button" aria-label="exit" onClick={onClick}>
    {primaryStyle ? <ExitIcon /> : <WhiteExitIcon />}
  </button>
);

Exit.defaultProps = {
  primaryStyle: false,
};

Exit.propTypes = {
  onClick: propTypes.func.isRequired,
  primaryStyle: propTypes.bool,
};

export default Exit;
