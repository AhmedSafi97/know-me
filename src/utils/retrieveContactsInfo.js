import { functions, auth, db } from '../firebase';

const retrieveContactsInfo = async () => {
  const contactsInfo = await db
    .ref(`users/${auth.currentUser.uid}/contacts`)
    .once('value')
    .then((snapshot) => snapshot.val());

  const info = Object.entries(contactsInfo).map(async ([contactId, chatId]) => {
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
        .then((snapshot) => snapshot.val());

      return {
        id: contactId,
        chatId,
        displayName,
        photoURL,
        text,
        timestamp,
      };
    } catch (err) {
      return null;
    }
  });

  return Promise.all(info);
};

export default retrieveContactsInfo;
