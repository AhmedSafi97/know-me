import { auth, db, functions } from '../firebase';
import { requestReceived, requestRemoved } from '../features/requestsSlice';
import store from '../store';

// Listen for new coming requests
const requestsAddedListener = (cb, ids) =>
  db
    .ref(`users/${auth.currentUser.uid}/received_requests`)
    .on('child_added', async (snapshot) => {
      const contactId = snapshot.key;

      // skipping the first trigger of the child_added
      if (!ids.includes(contactId)) {
        try {
          const fetchContactDetails = functions.httpsCallable(
            'fetchContactDetails'
          );
          const { data } = await fetchContactDetails({
            contactId,
          });
          const { displayName, photoURL, error } = data;
          if (error) throw new Error(error);

          cb(
            requestReceived({
              id: contactId,
              displayName,
              photoURL,
            })
          );
        } catch (err) {
          // skipping errors for the mean time
          console.log('');
        }
      }
    });

// listen for requests removed
// after accepting friendship request from the other party the request will be removed
const requestsRemovedListener = (cb) =>
  db
    .ref(`users/${auth.currentUser.uid}/received_requests`)
    .on('child_removed', (snapshot) => cb(requestRemoved(snapshot.key)));

// this will turn all listeners for requests (adding or removing)
const requestsListener = (cb) => {
  const state = store.getState();
  const { ids } = state.requests;
  requestsAddedListener(cb, ids);
  requestsRemovedListener(cb);
};

export default requestsListener;
