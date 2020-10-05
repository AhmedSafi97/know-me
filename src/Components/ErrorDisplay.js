import React from 'react';
import propTypes from 'prop-types';

import { ReactComponent as Cancel } from '../assets/cancel.svg';

const ErrorDisplay = ({ text, onClick }) =>
  text ? (
    <div className="relative w-full max-w-sm m-auto mt-10 text-red-700 text-lg">
      <p className="pr-5">{text}</p>
      <button
        type="button"
        aria-label="hide error"
        className="absolute right-0 top-x"
        onClick={onClick}
      >
        <Cancel />
      </button>
    </div>
  ) : null;

ErrorDisplay.propTypes = {
  text: propTypes.string.isRequired,
  onClick: propTypes.func.isRequired,
};

export default ErrorDisplay;
