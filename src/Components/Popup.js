import React from 'react';
import propTypes from 'prop-types';

const Popup = ({ onClick, children }) => (
  <div className="fixed w-full top-0 bottom-0 left-0 right-0 m-auto px-4 grid items-center justify-center z-10">
    <div className="shadow-lg m-auto p-4 border-primary-dark border-2  max-w-6xl h-64 overflow-y-scroll bg-white rounded-lg">
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

Popup.propTypes = {
  onClick: propTypes.func.isRequired,
  children: propTypes.node.isRequired,
};

export default Popup;
