import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { ReactComponent as Connect } from '../assets/connect.svg';
import { ReactComponent as ConnectActive } from '../assets/connect-selected.svg';
import { ReactComponent as Chat } from '../assets/chat.svg';
import { ReactComponent as ChatActive } from '../assets/chat-selected.svg';
import { ReactComponent as Profile } from '../assets/profile.svg';
import { ReactComponent as ProfileActive } from '../assets/profile-selected.svg';

const CONFIG = {
  CONNECT: { path: '/connect', Icon: Connect, ActiveIcon: ConnectActive },
  CHAT: { path: '/chats', Icon: Chat, ActiveIcon: ChatActive },
  PROFILE: { path: '/profile', Icon: Profile, ActiveIcon: ProfileActive },
};

const NavBar = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <nav className="flex lg:flex-col justify-between lg:items-center px-4 py-3 md:px-16 lg:px-2 lg:py-2 w-full lg:w-12 shadow-navbar lg:h-48">
      {Object.values(CONFIG).map(({ path, Icon, ActiveIcon }) => (
        <button
          key={path}
          type="button"
          className="focus:outline-none"
          onClick={() => history.push(path)}
        >
          {pathname.includes(path) ? <ActiveIcon /> : <Icon />}
        </button>
      ))}
    </nav>
  );
};

export default NavBar;
