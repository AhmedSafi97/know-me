import React from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import { functions } from '../firebase';
import {
  selectRequestById,
  selectRequestsIds,
} from '../features/requestsSlice';
import Contact from './Contact';

const Request = ({ contactId }) => {
  const { displayName, photoURL } = useSelector((state) =>
    selectRequestById(state, contactId)
  );

  return (
    <div type="button" className="mt-4 flex items-center">
      <Contact image={photoURL} />
      <p className="ml-2 flex-grow">{displayName}</p>
      <button
        type="button"
        className="text-white rounded-full bg-blue font-bold p-2"
        onClick={() => {
          const acceptFriendshipRequest = functions.httpsCallable(
            'acceptFriendshipRequest'
          );

          acceptFriendshipRequest({ id: contactId });
        }}
      >
        accept
      </button>
    </div>
  );
};

const RequestsList = () => {
  const requestsIds = useSelector(selectRequestsIds);

  return (
    <div className="w-64">
      {requestsIds.map((contactId) => (
        <Request key={contactId} contactId={contactId} />
      ))}
    </div>
  );
};

Request.propTypes = {
  contactId: propTypes.string.isRequired,
};

export default RequestsList;
