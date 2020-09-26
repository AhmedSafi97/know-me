import { auth, db, functions } from '../firebase';
import { contactAdded, contactRemoved } from '../features/contactsSlice';

// Listen for new contacts added
const addingListener = (cb, ids) =>
  db
    .ref(`users/${auth.currentUser.uid}/contacts`)
    .on('child_added', async (snapshot) => {
      const contactId = snapshot.key;
      const chatId = snapshot.val();

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

          const { text, timestamp } = await db
            .ref(`chats/${chatId}/last_msg`)
            .once('value')
            .then((lastMsgSnapshot) => lastMsgSnapshot.val());

          cb(
            contactAdded({
              id: contactId,
              chatId,
              displayName,
              photoURL,
              text,
              timestamp,
            })
          );
        } catch (err) {
          // skipping errors for the mean time
          console.log('');
        }
      }
    });

// listen for removed contacts
// in case of adding the feature of deleting contacts
const removingListener = (cb) =>
  db
    .ref(`users/${auth.currentUser.uid}/contacts`)
    .on('child_removed', (snapshot) => cb(contactRemoved(snapshot.key)));

// this will turn on all listeners for contacts (adding or removing)
const contactsListener = (cb, ids) => {
  addingListener(cb, ids);
  removingListener(cb);
};

export default contactsListener;
