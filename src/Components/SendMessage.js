import React from 'react';
import propTypes from 'prop-types';

import { ReactComponent as Send } from '../assets/send.svg';
import { ReactComponent as SendActive } from '../assets/send-active.svg';

const SendMessage = ({ value, onChange, onClick }) => (
  <form className="flex justify-between px-4 py-3 w-full shadow-navbar">
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="outline-none text-gray-medium"
    />
    <button type="submit" aria-label="send message" onClick={onClick}>
      {value ? <SendActive className="inline" /> : <Send className="inline" />}
    </button>
  </form>
);

SendMessage.propTypes = {
  onClick: propTypes.func.isRequired,
  onChange: propTypes.func.isRequired,
  value: propTypes.string.isRequired,
};

export default SendMessage;
