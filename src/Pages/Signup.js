import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { auth } from '../firebase';
import { getErrorMessage } from '../utils';
import { Button, TextInput, ErrorDisplay } from '../Components';
import { ReactComponent as Password } from '../assets/password.svg';
import { ReactComponent as Email } from '../assets/email-dark.svg';
import { ReactComponent as Arrow } from '../assets/right-arrow.svg';

const Signup = () => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () =>
    auth
      .createUserWithEmailAndPassword(email, password)
      .catch(({ code }) => setError(getErrorMessage(code)));

  const matchPassword = () =>
    password === confirmPassword
      ? handleSignup()
      : setError("Passwords don't match");

  const btnDisabled = !(
    email.length > 5 &&
    password.length > 5 &&
    confirmPassword.length > 5
  );

  return (
    <div>
      <div className="h-48 grid content-between mt-12 mb-8">
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
        <TextInput
          placeholder="Confirm Password"
          label="confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        >
          <Password className="absolute left-icon top-icon" />
        </TextInput>
      </div>
      <Button disabled={btnDisabled} onClick={matchPassword}>
        <span>SIGNUP</span>
      </Button>
      <ErrorDisplay text={error} onClick={() => setError('')} />
      <button
        type="button"
        className="block m-auto mt-16"
        onClick={() => history.push('/login')}
      >
        <span className="mr-1">Already have an account?</span>
        <Arrow className="inline ml-1" />
      </button>
    </div>
  );
};

export default Signup;
