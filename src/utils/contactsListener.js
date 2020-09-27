import { auth, db, functions } from '../firebase';
import { contactAdded, contactRemoved } from '../features/contactsSlice';
import store from '../store';

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
const contactsListener = (cb) => {
  /* this function will be triggered after all contacts have been fetched successfully
  so, contacts indeed will be available in the redux store */
  /* we are reaching the store here instead of passing the state we need as an argument
  since this function will be executed in the useEffect and will have this argument
  as a dependency and will trigger a re-render. */
  const state = store.getState();
  const { ids } = state.contacts;
  contactsAddedListener(cb, ids);
  contactsRemovedListener(cb);
};

export default contactsListener;
