import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import {
  selectContactById,
  selectContactsIds,
} from '../features/contactsSlice';
import { selectLastMessageById } from '../features/lastMessagesSlice';
import Spinner from './Spinner';
import Contact from './Contact';
import LastMessage from './LastMessage';

const LastMessageExcerpt = ({ contactId }) => {
  const history = useHistory();
  const { displayName, photoURL, chatId } = useSelector((state) =>
    selectContactById(state, contactId)
  );
  const { text, timestamp } = useSelector((state) =>
    selectLastMessageById(state, chatId)
  );

  if (text) {
    return (
      <button
        type="button"
        key={contactId}
        className="mt-4 flex items-center"
        onClick={() => history.push(`/chats/${chatId}`)}
      >
        <Contact image={photoURL} />
        <LastMessage
          contact={displayName}
          message={text}
          timestamp={timestamp}
          seen={false}
        />
      </button>
    );
  }

  return null;
};

const LastMessagesList = () => {
  const contactsIds = useSelector(selectContactsIds);
  const contactsStatus = useSelector((state) => state.contacts.status);
  const contactsError = useSelector((state) => state.contacts.error);

  let contacts;

  if (contactsStatus === 'loading') {
    contacts = <Spinner centered={false} />;
  } else if (contactsStatus === 'succeeded') {
    contacts = contactsIds.map((contactId) => (
      <LastMessageExcerpt key={contactId} contactId={contactId} />
    ));
  } else if (contactsStatus === 'failed') {
    contacts = <div className="text-red-600 mt-2">{contactsError}</div>;
  }

  return <div>{contacts}</div>;
};

LastMessageExcerpt.propTypes = {
  contactId: propTypes.string.isRequired,
};

export default LastMessagesList;
