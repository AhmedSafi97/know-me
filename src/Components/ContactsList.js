import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import {
  selectContactById,
  selectContactsIds,
} from '../features/contactsSlice';
import Contact from './Contact';

const ContactExcerpt = ({ contactId }) => {
  const history = useHistory();
  const { displayName, photoURL } = useSelector((state) =>
    selectContactById(state, contactId)
  );

  return (
    <button
      type="button"
      key={contactId}
      className="mt-4 flex items-center"
      onClick={() => history.push(`/chats/${contactId}`)}
    >
      <Contact image={photoURL} />
      <p className="ml-2">{displayName}</p>
    </button>
  );
};

const ContactsList = () => {
  const contactsIds = useSelector(selectContactsIds);

  return (
    <div>
      {contactsIds.map((contactId) => (
        <ContactExcerpt key={contactId} contactId={contactId} />
      ))}
    </div>
  );
};

ContactExcerpt.propTypes = {
  contactId: propTypes.string.isRequired,
};

export default ContactsList;
