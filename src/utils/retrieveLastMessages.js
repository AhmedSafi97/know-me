import { auth, db } from '../firebase';

const retrieveLastMessages = async () => {
  const chatsInfo = await db
    .ref(`users/${auth.currentUser.uid}/chats`)
    .once('value')
    .then((snapshot) => snapshot.val());

  if (chatsInfo) {
    const info = Object.entries(chatsInfo).map(async ([chatId]) => {
      try {
        const { text, timestamp } = await db
          .ref(`chats/${chatId}/last_msg`)
          .once('value')
          .then((snapshot) => snapshot.val());

        return {
          id: chatId,
          text,
          timestamp,
        };
      } catch (err) {
        return null;
      }
    });

    return Promise.all(info);
  }
  return [];
};

export default retrieveLastMessages;
