const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const clear = async (room, user1, user2) => {
  const root = admin.database();
  await root.ref(`random/rooms/${room}`).remove();
  await root.ref(`random/users/${user1}`).remove();
  await root.ref(`random/users/${user2}`).remove();
  await root.ref(`users/${user1}/random`).remove();
  await root.ref(`users/${user2}/random`).remove();
};

exports.findUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  } else {
    const { email } = context.auth.token;
    const receiverEmail = data.email;

    if (email === receiverEmail) return { result: 'not found' };

    try {
      const userRecord = await admin.auth().getUserByEmail(receiverEmail);
      const { uid, displayName, photoURL } = userRecord.toJSON();
      if (uid) return { uid, displayName, photoURL };

      return { result: 'not found' };
    } catch (err) {
      return { result: 'not found' };
    }
  }
});

exports.sendFriendRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  } else {
    try {
      const senderId = context.auth.uid;
      const receiverId = data.id;
      await admin
        .database()
        .ref(`users/${receiverId}/received_requests`)
        .update({ [senderId]: true });
      return {};
    } catch (err) {
      return { error: 'Something went wrong' };
    }
  }
});

exports.fetchContactDetails = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  } else {
    try {
      const { contactId } = data;
      const contactRef = admin.database().ref(`users/${contactId}`);
      const contactAge = await contactRef
        .child('age')
        .once('value')
        .then((snap) => snap.val());
      const contactGender = await contactRef
        .child('gender')
        .once('value')
        .then((snap) => snap.val());
      const contactRecord = await admin.auth().getUser(contactId);
      const { displayName, photoURL } = contactRecord.toJSON();

      return { displayName, photoURL, contactAge, contactGender };
    } catch (err) {
      return { error: 'Something went wrong' };
    }
  }
});

exports.acceptFriendshipRequest = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.'
      );
    } else {
      try {
        const receiverId = context.auth.uid;
        const senderId = data.id;

        const receiverRef = admin.database().ref(`users/${receiverId}`);
        const senderRef = admin.database().ref(`users/${senderId}`);

        await receiverRef.child('received_requests').child(senderId).remove();
        await senderRef.child('sent_requests').child(receiverId).remove();

        const roomRef = await admin.database().ref(`rooms`).push();
        const roomId = roomRef.key;

        await receiverRef.child('contacts').update({ [senderId]: roomId });
        await senderRef.child('contacts').update({ [receiverId]: roomId });

        await roomRef.set({
          [senderId]: true,
          [receiverId]: true,
          last_msg: {
            msg: {
              text: '',
              timestamp: Date.now(),
            },
          },
        });

        return {};
      } catch (err) {
        return { error: 'Something went wrong' };
      }
    }
  }
);

exports.makeAvailableToConnect = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.'
      );
    } else {
      const { uid } = context.auth;
      await admin
        .database()
        .ref('random/users')
        .update({ [uid]: 'waiting' });
    }

    return {};
  }
);

exports.makeUnavailableToConnect = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.'
      );
    } else {
      const { uid } = context.auth;
      await admin.database().ref('random/users').child(uid).remove();
    }

    return {};
  }
);

exports.checkIn = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  } else {
    const { roomId, contactId } = data;
    const userId = context.auth.uid;
    const roomRef = admin.database().ref(`random/rooms/${roomId}`);

    const status = await roomRef
      .child(contactId)
      .once('value')
      .then((snap) => snap.val());

    if (status === 'in') {
      await roomRef.update({
        [userId]: 'in',
        [contactId]: 'out',
      });

      return { status: 'in' };
    }

    await clear(roomId, userId, contactId);

    return { status: 'out' };
  }
});

exports.disconnect = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  } else {
    const { roomId, contactId } = data;
    const userId = context.auth.uid;

    await clear(roomId, userId, contactId);

    return {};
  }
});

exports.connectUsersRandomly = functions.database
  .ref('random/users/{userId}')
  .onCreate(async (snapshot, context) => {
    const { userId } = context.params;

    const usersRef = snapshot.ref.parent;

    // return users with status of waiting including the current user
    const users = await usersRef
      .orderByValue()
      .equalTo('waiting')
      .once('value')
      .then((userSnapshot) => userSnapshot.val());
    // delete the current user from the list
    // no user wants to connect with him/her self
    delete users[userId];

    // taking the first user from the list
    const [userToConnectWith] = Object.keys(users);

    // check if there is a user to connect with
    if (userToConnectWith) {
      const roomRef = await usersRef.parent.child('rooms').push();
      const roomId = roomRef.key;
      const contactsRef = admin.database().ref('users');

      await roomRef.set({
        [userId]: 'in',
        [userToConnectWith]: 'in',
      });

      await usersRef.update({
        [userId]: 'connected',
      });

      await usersRef.update({
        [userToConnectWith]: 'connected',
      });

      await contactsRef
        .child(userToConnectWith)
        .child('random')
        .set({
          [roomId]: userId,
        });

      await contactsRef
        .child(userId)
        .child('random')
        .set({
          [roomId]: userToConnectWith,
        });
    }

    return null;
  });
