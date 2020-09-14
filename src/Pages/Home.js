import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Header, Button } from '../Components';
import { ReactComponent as GoogleIcon } from '../assets/google.svg';
import { ReactComponent as EmailIcon } from '../assets/email.svg';

import { auth, googleProvider } from '../firebase';

const Home = () => {
  const history = useHistory();

  const [error, setError] = useState();

  const googleLogin = () =>
    auth
      .signInWithPopup(googleProvider)
      .catch(() => setError('Something went wrong, please try again later.'));

  return (
    <div className="h-screen">
      <Header />
      <div className="px-4">
        <p className="text-6xl w-56 leading-none font-bold text-center m-auto my-10">
          Meet Fun People Know
        </p>
        <div className="h-32 grid content-between">
          <Button onClick={() => history.push('/login')}>
            <EmailIcon className="inline mr-1" />
            <span className="ml-1">Login with Email</span>
          </Button>
          <Button primaryStyle={false} onClick={googleLogin}>
            <GoogleIcon className="inline mr-1" />
            <span className="ml-1">Login with Google</span>
          </Button>
        </div>
        {error && <p className="text-red-700 my-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Home;
