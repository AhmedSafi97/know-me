import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { auth } from '../firebase';
import { Button, TextInput } from '../Components';
import { ReactComponent as Password } from '../assets/password.svg';
import { ReactComponent as Email } from '../assets/email-dark.svg';
import { ReactComponent as Arrow } from '../assets/right-arrow.svg';

const validateForm = (email, password) => {
  if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return 'Invalid email address';
  }
  if (!password || !/^.{6,}$/i.test(password)) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

const Login = () => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  const handleLogin = () => {
    const validationResult = validateForm(email, password);
    if (validationResult === null) {
      auth.signInWithEmailAndPassword(email, password).catch(({ code }) => {
        if (code === 'auth/user-not-found' || code === 'auth/wrong-password')
          setError('Please double check your password or email');
        else setError('Something went wrong, please try again later');
      });
    } else {
      setError(validationResult);
    }
  };

  return (
    <div>
      <div className="h-32 grid content-between mt-12 mb-8">
        <TextInput
          placeholder="Email"
          label="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        >
          <Email className="absolute left-icon top-icon" />
        </TextInput>
        <TextInput
          placeholder="Password"
          label="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
          <Password className="absolute left-icon top-icon" />
        </TextInput>
      </div>
      <Button onClick={() => handleLogin()}>
        <span>LOGIN</span>
      </Button>
      {error && <p className="text-red-700 my-2 text-center">{error}</p>}
      <button
        type="button"
        className="block text-blue m-auto mt-4"
        onClick={() => history.push('/login/reset')}
      >
        <span>Forgot Password?</span>
      </button>
      <button
        type="button"
        className="block m-auto mt-20"
        onClick={() => history.push('/signup')}
      >
        <span className="mr-1">Create new Account</span>
        <Arrow className="inline ml-1" />
      </button>
    </div>
  );
};

export default Login;
