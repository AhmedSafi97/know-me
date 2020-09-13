import React from 'react';
import propTypes from 'prop-types';

const Button = ({ primaryStyle, onClick, children }) => (
  <button
    type="button"
    className={`w-full max-w-sm py-4 m-auto rounded-full flex justify-center items-center ${
      primaryStyle ? 'bg-blue text-white' : 'bg-gray-light text-gray-dark'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.defaultProps = {
  primaryStyle: true,
};

Button.propTypes = {
  primaryStyle: propTypes.bool,
  onClick: propTypes.func.isRequired,
  children: propTypes.node.isRequired,
};

export default Button;
