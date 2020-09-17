import React from 'react';
import propTypes from 'prop-types';

const getDate = (timeStamp) =>
  new Date(timeStamp).toLocaleString('default', {
    month: 'short',
    day: 'numeric',
  });

const LastMessage = ({ contact, message, timestamp, seen }) => (
  <div>
    <p className="text-gray-dark font-bold">{contact}</p>
    <p className="flex">
      <span
        className={`${
          seen ? 'text-gray-medium' : 'text-gray-dark font-medium'
        } inline-block w-48 truncate`}
      >
        {message}
      </span>
      <span className="text-gray-medium ml-4">{getDate(timestamp)}</span>
    </p>
  </div>
);
LastMessage.propTypes = {
  contact: propTypes.string.isRequired,
  message: propTypes.string.isRequired,
  timestamp: propTypes.number.isRequired,
  seen: propTypes.bool.isRequired,
};

export default LastMessage;
