import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { auth } from '../firebase';
import { Button, TextInput } from '../Components';
import { ReactComponent as Password } from '../assets/password.svg';
import { ReactComponent as Email } from '../assets/email-dark.svg';
import { ReactComponent as Arrow } from '../assets/right-arrow.svg';

const validateForm = (email, password, confirmPassword) => {
  if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return 'Invalid email address';
  }
  if (!password || !/^.{6,}$/i.test(password)) {
    return 'Password must be at least 6 characters';
  }
  if (confirmPassword !== password) return "Passwords don't match";
  return null;
};

const Signup = () => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState();

  const handleSignup = () => {
    const validationResult = validateForm(email, password, confirmPassword);
    if (validationResult === null) {
      auth.createUserWithEmailAndPassword(email, password).catch(({ code }) => {
        if (code === 'auth/email-already-in-use')
          setError('Email already in use');
        else setError('Something went wrong, please try again later');
      });
    } else {
      setError(validationResult);
    }
  };

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
      <Button onClick={() => handleSignup()}>
        <span>SIGNUP</span>
      </Button>
      {error && <p className="text-red-700 my-2 text-center">{error}</p>}
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
