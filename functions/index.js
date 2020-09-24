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
        .ref(`users/${receiverId}/friendship_requests`)
        .set({ [senderId]: true });
      return {};
    } catch (err) {
      return { error: 'Something went wrong' };
    }
  }
});
