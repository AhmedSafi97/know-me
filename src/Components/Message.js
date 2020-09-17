import React from 'react';
import propTypes from 'prop-types';

const CONFIG = {
  right: 'bg-blue text-white rounded-l-xl',
  left: 'bg-gray-light text-gray-dark rounded-r-xl',
};

const Message = ({ text, direction }) => (
  <div className={`${direction === 'right' ? 'self-end' : ''}`}>
    <p
      className={`${CONFIG[direction]} inline-block max-w-xs mb-2 rounded-b-xl px-4 py-2`}
    >
      {text}
    </p>
  </div>
);

Message.propTypes = {
  text: propTypes.string.isRequired,
  direction: propTypes.string.isRequired,
};

export default Message;
