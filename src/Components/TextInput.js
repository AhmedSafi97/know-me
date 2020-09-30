import React from 'react';
import propTypes from 'prop-types';

const TextInput = ({ children, placeholder, value, label, type, onChange }) => (
  <div className="relative w-full max-w-sm m-auto">
    {children}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      aria-label={label}
      onChange={onChange}
      className="shadow-md block bg-gray-light text-gray-dark placeholder-gray-dark placeholder-opacity-100 rounded-full w-full py-4 px-12 m-auto"
    />
  </div>
);

TextInput.propTypes = {
  children: propTypes.node.isRequired,
  placeholder: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
  type: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
};

export default TextInput;
