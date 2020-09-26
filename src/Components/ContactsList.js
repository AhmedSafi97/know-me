import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import {
  fetchContacts,
  selectContactById,
  selectContactsIds,
} from '../features/contactsSlice';
import { contactsListener } from '../utils';
import Spinner from './Spinner';
import Contact from './Contact';

const ContactExcerpt = ({ contactId }) => {
  const history = useHistory();
  const { displayName, photoURL, chatId } = useSelector((state) =>
    selectContactById(state, contactId)
  );

  return (
    <button
      type="button"
      key={contactId}
      className="mt-4 flex items-center"
      onClick={() => history.push(`/chats/${chatId}`)}
    >
      <Contact image={photoURL} />
      <p className="ml-2">{displayName}</p>
    </button>
  );
};

const Contacts = () => {
  const dispatch = useDispatch();
  const contactsIds = useSelector(selectContactsIds);
  const contactsStatus = useSelector((state) => state.contacts.status);
  const contactsError = useSelector((state) => state.contacts.error);

  useEffect(() => {
    if (contactsStatus === 'idle') {
      dispatch(fetchContacts());
    } else if (contactsStatus === 'succeeded') {
      contactsListener(dispatch, contactsIds);
    }
  }, [dispatch, contactsStatus, contactsIds]);

  let contacts;

  if (contactsStatus === 'loading') {
    contacts = <Spinner centered={false} />;
  } else if (contactsStatus === 'succeeded') {
    contacts = contactsIds.map((contactId) => (
      <ContactExcerpt key={contactId} contactId={contactId} />
    ));
  } else if (contactsStatus === 'failed') {
    contacts = <div className="text-red-600 mt-2">{contactsError}</div>;
  }

  return <div>{contacts}</div>;
};

ContactExcerpt.propTypes = {
  contactId: propTypes.string.isRequired,
};

export default Contacts;
