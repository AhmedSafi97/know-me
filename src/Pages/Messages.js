import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { auth, db } from '../firebase';
import { selectContactById } from '../features/contactsSlice';
import {
  selectAllChats,
  fetchChats,
  chatAdded,
  chatsRemoved,
} from '../features/chatsSlice';
import { chatsListener } from '../utils';
import { Message, Exist, Contact, SendMessage, Spinner } from '../Components';

const Messages = () => {
  const messagesRef = useRef();
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const history = useHistory();
  const { id } = useParams();

  const contact = useSelector((state) => selectContactById(state, id));

  const chats = useSelector(selectAllChats);
  const chatsStatus = useSelector((state) => state.chats.status);
  const chatsError = useSelector((state) => state.chats.error);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (contact) {
      const { roomId } = contact;

      if (chatsStatus === 'idle') {
        dispatch(
          fetchChats({ roomId, user1: auth.currentUser.uid, user2: id })
        );
      } else if (chatsStatus === 'succeeded') {
        chatsListener(roomId, id, dispatch);
      }

      return () => db.ref(`rooms/${roomId}/chats/${id}`).off();
    }
  }, [dispatch, id, chatsStatus, contact]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chats]);

  const sendMessage = async (e) => {
    if (message) {
      e.preventDefault();
      const { roomId } = contact;
      const timestamp = Date.now();

      const newMessageRef = await db
        .ref(`rooms/${roomId}/chats/${auth.currentUser.uid}`)
        .push();
      await newMessageRef.update({
        text: message,
        timestamp: Date.now(),
      });
      await db.ref(`rooms/${roomId}/last_msg/msg`).set({
        text: message,
        timestamp,
      });

      dispatch(
        chatAdded({
          id: newMessageRef.key,
          contact: 'right',
          text: message,
          timestamp,
        })
      );

      setMessage('');
    }
  };

  let content;

  if (chatsStatus === 'loading') {
    content = <div className="loader">loading...</div>;
  } else if (chatsStatus === 'succeeded') {
    content = chats.map((msg) => (
      <Message key={msg.id} text={msg.text} direction={msg.contact} />
    ));
  } else if (chatsStatus === 'failed') {
    content = <div>{chatsError}</div>;
  }

  if (contact) {
    const { displayName, photoURL } = contact;

    return (
      <div>
        <header className="p-2 md:px-16 xl:px-32 shadow-navbar text-center text-2xl text-gray-dark flex">
          <Exist
            onClick={() => {
              history.push('/chats');
              dispatch(chatsRemoved());
            }}
          />
          <div className="flex-grow-2 flex flex-col items-center">
            <Contact image={photoURL} />
            <p className="text-sm mt-1">{displayName}</p>
          </div>
        </header>
        <div
          ref={messagesRef}
          className="flex flex-col overflow-y-scroll break-words h-fit w-full max-w-4xl m-auto p-4"
        >
          {content}
        </div>
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
  return <Spinner />;
};

export default Messages;
