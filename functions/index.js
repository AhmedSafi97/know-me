const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

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
      const contactRecord = await admin.auth().getUser(contactId);
      const { displayName, photoURL } = contactRecord.toJSON();

      return { displayName, photoURL };
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
