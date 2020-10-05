import React from 'react';
import propTypes from 'prop-types';

const Button = ({ primaryStyle, onClick, children, disabled }) => (
  <button
    type="button"
    className={`shadow-lg w-full max-w-sm py-4 m-auto rounded-full flex justify-center items-center ${
      disabled ? 'opacity-50' : 'opacity-100'
    } ${
      primaryStyle ? 'bg-blue  text-white' : 'bg-gray-light text-gray-dark'
    } `}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.defaultProps = {
  primaryStyle: true,
  disabled: false,
};

Button.propTypes = {
  primaryStyle: propTypes.bool,
  onClick: propTypes.func.isRequired,
  children: propTypes.node.isRequired,
  disabled: propTypes.bool,
};

export default Button;
