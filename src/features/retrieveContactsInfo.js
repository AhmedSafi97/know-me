import { functions, auth, db } from '../firebase';

const retrieveContactsInfo = async () => {
  const contactsInfo = await db
    .ref(`users/${auth.currentUser.uid}/contacts`)
    .once('value')
    .then((snapshot) => snapshot.val());

  if (contactsInfo) {
    const info = Object.entries(contactsInfo).map(
      async ([contactId, chatId]) => {
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
            chatId,
            displayName,
            photoURL,
          };
        } catch (err) {
          return null;
        }
      }
    );

    return Promise.all(info);
  }
  return [];
};

export default retrieveContactsInfo;
