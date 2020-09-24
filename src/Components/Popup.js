import React from 'react';
import propTypes from 'prop-types';

const Popup = ({ onClick, children }) => (
  <div className="fixed w-full top-0 bottom-0 left-0 right-0 m-auto px-4 grid items-center justify-center">
    <div className="m-auto p-4 bg-white border-primary-dark border-2">
      <button
        type="button"
        className="w-6 h-6 p-1 mb-4 focus:outline-none hover:bg-primary-lighter"
        onClick={onClick}
      >
        cancel
      </button>
      <div>{children}</div>
    </div>
  </div>
);

Popup.prototype = {
  onClick: propTypes.func.isRequired,
  children: propTypes.node.isRequired,
};

export default Popup;
