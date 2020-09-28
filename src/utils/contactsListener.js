import { auth, db, functions } from '../firebase';
import { contactAdded, contactRemoved } from '../features/contactsSlice';
import { lastMessageAdded } from '../features/lastMessagesSlice';

// Listen for new contacts added
const contactsAddedListener = (cb, ids) =>
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

          cb(
            contactAdded({
              id: contactId,
              chatId,
              displayName,
              photoURL,
            })
          );

          const { text, timestamp } = await db
            .ref(`chats/${chatId}/last_msg/msg`)
            .once('value')
            .then((chatSnapshot) => chatSnapshot.val());

          cb(
            lastMessageAdded({
              id: chatId,
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
const contactsRemovedListener = (cb) =>
  db
    .ref(`users/${auth.currentUser.uid}/contacts`)
    .on('child_removed', (snapshot) => cb(contactRemoved(snapshot.key)));

// this will turn on all listeners for contacts (adding or removing)
const contactsListener = () => {
  let executed = false;

  return {
    // this way we guarantee that the listeners will be triggered only once
    listen: (cb, ids) => {
      if (!executed) {
        executed = true;
        contactsAddedListener(cb, ids);
        contactsRemovedListener(cb);
      }
    },
    // this will clear closure variables, should be used after logging out,
    // so a new log in can turn on listeners
    remove: () => {
      executed = false;
    },
  };
};

export default contactsListener();
