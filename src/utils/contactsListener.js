import { auth, db, functions } from '../firebase';
import { contactAdded, contactRemoved } from '../features/contactsSlice';
import { roomAdded, roomUpdated, roomRemoved } from '../features/roomsSlice';

// Listen for new contacts added
// for each added contact a room will be added also
// and a listener for the new room will be called
const contactsAddedListener = (dispatch) =>
  db
    .ref(`users/${auth.currentUser.uid}/contacts`)
    .on('child_added', async (snapshot) => {
      const contactId = snapshot.key;
      const roomId = snapshot.val();

      try {
        const fetchContactDetails = functions.httpsCallable(
          'fetchContactDetails'
        );
        const { data } = await fetchContactDetails({
          contactId,
        });
        const { displayName, photoURL, error } = data;

        if (error) throw new Error(error);

        const { text, timestamp } = await db
          .ref(`rooms/${roomId}/last_msg/msg`)
          .once('value')
          .then((msgSnapshot) => msgSnapshot.val());

        dispatch(
          roomAdded({
            id: roomId,
            contactId,
            text,
            timestamp,
          })
        );
        dispatch(
          contactAdded({
            id: contactId,
            roomId,
            displayName,
            photoURL,
          })
        );

        await db
          .ref(`rooms/${roomId}/last_msg`)
          .on('child_changed', (msgSnapshot) => {
            const {
              text: msgText,
              timestamp: msgTimestamp,
            } = msgSnapshot.val();

            dispatch(
              roomUpdated({
                id: roomId,
                changes: {
                  text: msgText,
                  timestamp: msgTimestamp,
                },
              })
            );
          });
      } catch (err) {
        console.log(err);
        // skipping errors for the mean time
        console.log('');
      }
    });

// listen for removed contacts
// in case of adding the feature of deleting contacts
const contactsRemovedListener = (dispatch) =>
  db
    .ref(`users/${auth.currentUser.uid}/contacts`)
    .on('child_removed', (snapshot) => {
      dispatch(contactRemoved(snapshot.key));
      dispatch(roomRemoved(snapshot.val()));
    });

// this will turn on all listeners for contacts (adding or removing)
const contactsListener = (dispatch) => {
  contactsAddedListener(dispatch);
  contactsRemovedListener(dispatch);
};

export default contactsListener;
