import { db } from '../firebase';

const getChats = async (room, user1, user2) => {
  const user1Msgs = await db
    .ref(`rooms/${room}/chats/${user1}`)
    .once('value')
    .then((snapshot) => snapshot.val());
  const user2Msgs = await db
    .ref(`rooms/${room}/chats/${user2}`)
    .once('value')
    .then((snapshot) => snapshot.val());

  const user1Chats = [];
  const user2Chats = [];

  if (user1Msgs) {
    Object.entries(user1Msgs).forEach(([id, val]) => {
      const { text, timestamp } = val;
      user1Chats.push({
        id,
        contact: 'right',
        text,
        timestamp,
      });
    });
  }

  if (user2Msgs) {
    Object.entries(user2Msgs).forEach(([id, val]) => {
      const { text, timestamp } = val;
      user2Chats.push({
        id,
        contact: 'left',
        text,
        timestamp,
      });
    });
  }

  const chats = user1Chats.concat(user2Chats);

  return chats;
};

export default getChats;
