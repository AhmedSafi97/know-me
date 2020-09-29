import { auth, db, functions } from '../firebase';
import { requestReceived, requestRemoved } from '../features/requestsSlice';

// Listen for new coming requests
const requestsAddedListener = (dispatch) =>
  db
    .ref(`users/${auth.currentUser.uid}/received_requests`)
    .on('child_added', async (snapshot) => {
      const contactId = snapshot.key;
      try {
        const fetchContactDetails = functions.httpsCallable(
          'fetchContactDetails'
        );
        const { data } = await fetchContactDetails({
          contactId,
        });
        const { displayName, photoURL, error } = data;

        if (error) throw new Error(error);

        dispatch(
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
    });

// listen for requests removed
// after accepting friendship request from the other party the request will be removed
const requestsRemovedListener = (dispatch) =>
  db
    .ref(`users/${auth.currentUser.uid}/received_requests`)
    .on('child_removed', (snapshot) => dispatch(requestRemoved(snapshot.key)));

// this will turn all listeners for requests (adding or removing)
const requestsListener = (dispatch) => {
  requestsAddedListener(dispatch);
  requestsRemovedListener(dispatch);
};

export default requestsListener;
