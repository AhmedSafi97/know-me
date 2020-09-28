import { functions, auth, db } from '../firebase';

const retrieveRequestsInfo = async () => {
  const requestsInfo = await db
    .ref(`users/${auth.currentUser.uid}/received_requests`)
    .once('value')
    .then((snapshot) => snapshot.val());

  if (requestsInfo) {
    const info = Object.entries(requestsInfo).map(async ([contactId]) => {
      try {
        const fetchContactDetails = functions.httpsCallable(
          'fetchContactDetails'
        );
        const { data } = await fetchContactDetails({
          contactId,
        });
        const { displayName, photoURL, error } = data;
        if (error) throw new Error(error);

        return {
          id: contactId,
          displayName,
          photoURL,
        };
      } catch (err) {
        return null;
      }
    });

    return Promise.all(info);
  }
  return [];
};

export default retrieveRequestsInfo;
