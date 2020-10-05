import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, ErrorDisplay } from '../Components';
import { ReactComponent as GoogleIcon } from '../assets/google.svg';
import { ReactComponent as EmailIcon } from '../assets/email.svg';

import { auth, googleProvider } from '../firebase';

const Home = () => {
  const history = useHistory();

  const [error, setError] = useState('');

  const googleLogin = () =>
    auth
      .signInWithPopup(googleProvider)
      .catch(() => setError('Something went wrong, try again later.'));

  return (
    <div>
      <p className="text-6xl w-56 leading-none font-bold text-center m-auto mt-10 mb-5">
        Meet Fun People Know
      </p>
      <ErrorDisplay text={error} onClick={() => setError('')} />
      <div className="h-32 grid content-between mt-5">
        <Button onClick={() => history.push('/login')}>
          <EmailIcon className="inline mr-1" />
          <span className="ml-1">Login with Email</span>
        </Button>
        <Button primaryStyle={false} onClick={googleLogin}>
          <GoogleIcon className="inline mr-1" />
          <span className="ml-1">Login with Google</span>
        </Button>
      </div>
    </div>
  );
};

export default Home;
