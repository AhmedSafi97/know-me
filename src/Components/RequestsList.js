import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import { functions } from '../firebase';
import {
  selectRequestById,
  selectRequestsIds,
  fetchRequests,
} from '../features/requestsSlice';
import { requestsListener } from '../utils';
import Contact from './Contact';
import Spinner from './Spinner';

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
  const dispatch = useDispatch();
  const requestsIds = useSelector(selectRequestsIds);
  const requestsStatus = useSelector((state) => state.requests.status);
  const requestsError = useSelector((state) => state.requests.error);

  useEffect(() => {
    if (requestsStatus === 'idle') {
      dispatch(fetchRequests());
    } else if (requestsStatus === 'succeeded') {
      requestsListener(dispatch, requestsIds);
    }
  }, [dispatch, requestsStatus, requestsIds]);

  let requests;

  if (requestsStatus === 'loading') {
    requests = <Spinner centered={false} />;
  } else if (requestsStatus === 'succeeded') {
    requests = requestsIds.map((contactId) => (
      <Request key={contactId} contactId={contactId} />
    ));
  } else if (requestsStatus === 'failed') {
    requests = <div className="text-red-600 mt-2">{requestsError}</div>;
  }

  return <div className="w-64">{requests}</div>;
};

Request.propTypes = {
  contactId: propTypes.string.isRequired,
};

export default RequestsList;
