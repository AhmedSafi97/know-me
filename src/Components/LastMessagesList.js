import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import {
  selectContactById,
  selectContactsIds,
} from '../features/contactsSlice';
import { selectRoomById } from '../features/roomsSlice';
import Contact from './Contact';
import LastMessage from './LastMessage';

const LastMessageExcerpt = ({ contactId }) => {
  const history = useHistory();
  const { id, displayName, photoURL, roomId } = useSelector((state) =>
    selectContactById(state, contactId)
  );
  const { text, timestamp } = useSelector((state) =>
    selectRoomById(state, roomId)
  );

  if (text) {
    return (
      <button
        type="button"
        key={contactId}
        className="mt-4 flex items-center"
        onClick={() => history.push(`/chats/${id}`)}
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

  return (
    <div>
      {contactsIds.map((contactId) => (
        <LastMessageExcerpt key={contactId} contactId={contactId} />
      ))}
    </div>
  );
};

LastMessageExcerpt.propTypes = {
  contactId: propTypes.string.isRequired,
};

export default LastMessagesList;
