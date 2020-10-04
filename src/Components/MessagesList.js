import React, { useEffect, useRef } from 'react';
import propTypes from 'prop-types';

import Message from './Message';

const MessagesList = ({ messages }) => {
  const messagesRef = useRef();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messagesRef}
      className="flex flex-col overflow-y-scroll break-words h-fit w-full max-w-4xl m-auto p-4 pb-0"
    >
      {messages.map(({ id, contact, text }) => (
        <Message key={id} text={text} direction={contact} />
      ))}
    </div>
  );
};

MessagesList.propTypes = {
  messages: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string.isRequired,
      text: propTypes.string.isRequired,
      contact: propTypes.string.isRequired,
    })
  ).isRequired,
};

export default React.memo(MessagesList);
