import React from 'react';
import { useHistory } from 'react-router-dom';

import { NavBar, LastMessagesList } from '../Components';
import { ReactComponent as Contacts } from '../assets/contacts.svg';

const Chats = () => {
  const history = useHistory();

  return (
    <div className="flex flex-col h-screen">
      <h1 className="p-2 md:px-16 xl:px-32 shadow-navbar text-center text-2xl text-gray-dark">
        Chats
      </h1>
      <div className="relative p-4 md:px-16 xl:px-32 flex-grow text-gray-dark">
        <button
          type="button"
          className="absolute bottom-0 right-0"
          onClick={() => history.push('/chats/contacts')}
        >
          <Contacts className="inline mr-2" />
        </button>
        <div className="mt-4">
          <LastMessagesList />
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default Chats;
