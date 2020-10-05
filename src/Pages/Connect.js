import React, { useState, useEffect } from 'react';

import { functions, db, auth } from '../firebase';
import {
  Header,
  NavBar,
  WaitingToConnect,
  RandomContact,
  SendMessage,
  Contact,
  MessagesList,
  Exit,
} from '../Components';
import { ReactComponent as ConnectIcon } from '../assets/connects.svg';

const Connect = () => {
  const [waiting, setWaiting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [message, setMessage] = useState('');
  const [contact, setContact] = useState({});
  const [chats, setChats] = useState([]);

  useEffect(
    () => async () => {
      const { roomId, contactId } = contact;
      if (roomId && contactId) {
        await db.ref(`users/${auth.currentUser.uid}/random`).off();
        functions.httpsCallable('disconnect')({ roomId, contactId });
      }
    },
    [contact]
  );

  const clearStates = () => {
    setConnected(false);
    setChats([]);
    setMessage('');
    setContact({});
  };

  const clearListeners = (roomId, contactId) => {
    db.ref(`users/${auth.currentUser.uid}/random`).off();
    db.ref(`random/rooms/${roomId}/chats/${contactId}`).off();
  };

  const clear = (roomId, contactId, intervalRef) => {
    clearInterval(intervalRef);
    clearListeners(roomId, contactId);
    clearStates();
  };

  const checkIn = async (roomId, contactId, interval) => {
    const contactStatus = await functions.httpsCallable('checkIn')({
      roomId,
      contactId,
    });

    if (contactStatus.data.status === 'out') clear(roomId, contactId, interval);
  };

  const startConnecting = async () => {
    setWaiting(true);

    await functions.httpsCallable('makeAvailableToConnect')();

    await db
      .ref(`users/${auth.currentUser.uid}/random`)
      .on('child_added', async (snapshot) => {
        const roomId = snapshot.key;
        const contactId = snapshot.val();

        const contactDetails = await functions.httpsCallable(
          'fetchContactDetails'
        )({ contactId });

        setContact({ ...contactDetails.data, contactId, roomId });
        setConnecting(true);
        setWaiting(false);

        setTimeout(async () => {
          await db
            .ref(`random/rooms/${roomId}/chats/${contactId}`)
            .on('child_added', (snap) => {
              const id = snap.key;
              const { text, timestamp } = snap.val();

              setChats((state) =>
                [{ id, text, timestamp, contact: 'left' }, ...state].sort(
                  (a, b) => a.timestamp - b.timestamp
                )
              );
            });

          const interval = setInterval(
            () => checkIn(roomId, contactId, interval),
            30000
          );

          await db
            .ref(`users/${auth.currentUser.uid}/random`)
            .on('child_removed', async (snap) =>
              clear(snap.key, snap.val(), interval)
            );

          setConnecting(false);
          setConnected(true);
        }, 5000);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      startConnecting();
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message) {
      const { roomId } = contact;
      const timestamp = Date.now();

      const newMessageRef = await db
        .ref(`random/rooms/${roomId}/chats/${auth.currentUser.uid}`)
        .push();
      await newMessageRef.update({
        text: message,
        timestamp: Date.now(),
      });

      setChats((state) =>
        [
          {
            id: newMessageRef.key,
            contact: 'right',
            text: message,
            timestamp,
          },
          ...state,
        ].sort((a, b) => a.timestamp - b.timestamp)
      );

      setMessage('');
    }
  };

  const exitWaiting = async () => {
    await functions.httpsCallable('makeUnavailableToConnect')();
    setWaiting(false);
  };

  if (waiting) return <WaitingToConnect exitHandler={exitWaiting} />;

  if (connecting) {
    const { displayName, photoURL, contactAge, contactGender } = contact;
    return (
      <RandomContact
        name={displayName}
        image={photoURL}
        age={contactAge}
        gender={contactGender}
      />
    );
  }

  if (connected) {
    const { roomId, contactId, displayName, photoURL } = contact;

    return (
      <div>
        <header className="p-2 md:px-16 xl:px-32 shadow-navbar text-center text-2xl text-gray-dark flex">
          <Exit
            primaryStyle
            onClick={() =>
              functions.httpsCallable('disconnect')({ roomId, contactId })
            }
          />
          <div className="flex-grow-2 flex flex-col items-center">
            <Contact image={photoURL} />
            <p className="text-sm mt-1">{displayName}</p>
          </div>
        </header>
        <MessagesList messages={chats} />
        <div className="fixed bottom-0 left-0 right-0">
          <SendMessage
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onClick={sendMessage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Header />
      <div
        role="button"
        onKeyPress={handleKeyPress}
        onClick={startConnecting}
        tabIndex={0}
        className="flex flex-col items-center mt-half-screen p-4 md:px-16 xl:px-32 outline-none"
      >
        <ConnectIcon />
        <p className="mt-2 text-gray-dark font-bold">Click to start</p>
      </div>
      <NavBar />
    </div>
  );
};

export default Connect;
