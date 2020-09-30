import { chatAdded } from '../features/chatsSlice';

const { db } = require('../firebase');

const chatsListener = (roomId, userId, dispatch) =>
  db.ref(`rooms/${roomId}/chats/${userId}`).on('child_added', (snapshot) => {
    const id = snapshot.key;
    const { text, timestamp } = snapshot.val();

    dispatch(
      chatAdded({
        id,
        contact: 'left',
        text,
        timestamp,
      })
    );
  });

export default chatsListener;
