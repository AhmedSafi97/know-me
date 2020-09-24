import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { storage, auth, emailProvider } from '../firebase';
import {
  selectCurrentUser,
  currentUserAdded,
} from '../features/currentUserSlice';
import { NavBar, Spinner, Button, TextInput, Popup } from '../Components';
import { ReactComponent as Camera } from '../assets/camera.svg';
import { ReactComponent as Email } from '../assets/email-dark.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';
import { ReactComponent as Password } from '../assets/password.svg';
import { ReactComponent as ExitIcon } from '../assets/exit.svg';

const dateDiff = (date) => {
  const currentDate = new Date();
  const timeUpdated = new Date(date);
  return Math.round(Math.abs(currentDate - timeUpdated) / 60000);
};

const Profile = () => {
  const { id, name, photo, email } = useSelector(selectCurrentUser);

  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editError, setEditError] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleNewPhoto = async (e) => {
    if (e.target.files) {
      const photoObj = e.target.files[0];
      const imageSrc = await storage.ref().child('photos').child(id);

      let lastUpdate;

      try {
        const oldImage = await imageSrc.list();
        const oldImageRef = await storage.ref(oldImage.items[0].location.path);
        const { updated } = await oldImageRef.getMetadata();
        lastUpdate = dateDiff(updated);
      } catch (err) {
        lastUpdate = 6;
      }

      if (lastUpdate < 5) {
        setError("You've just updated your photo, wait another five minutes");
      } else if (photoObj.size > 1000000) {
        setError('Image size is too large');
      } else if (
        photoObj.type !== 'image/png' &&
        photoObj.type !== 'image/jpeg'
      ) {
        setError('Invalid image type');
      } else {
        setUploading(true);

        try {
          const oldImage = await imageSrc.list();
          const oldImageRef = await storage.ref(
            oldImage.items[0].location.path
          );
          await oldImageRef.delete();
        } catch (err) {
          console.log('');
        }

        const uploadTask = imageSrc.child(photoObj.name).put(photoObj);
        uploadTask.on(
          'state_changed',
          null,
          () => {
            setError('Something went wrong, please try again later');
            setUploading(false);
          },
          async () => {
            try {
              const photoUrl = await imageSrc
                .child(photoObj.name)
                .getDownloadURL();

              auth.currentUser.updateProfile({
                displayName: name,
                photoURL: photoUrl,
              });

              setUploading(false);
              dispatch(currentUserAdded(id, name, photoUrl, email, true));
            } catch (err) {
              setError('Something went wrong, please try again later');
              setUploading(false);
            }
          }
        );
      }
    }
  };

  const handleChangeEmail = async () => {
    try {
      const user = auth.currentUser;
      const credential = emailProvider.credential(email, password);
      await user.reauthenticateWithCredential(credential);
      if (
        !newEmail ||
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)
      ) {
        setEditError('Invalid email address');
      } else {
        await user.updateEmail(newEmail);
        setEditError('');
        setEditEmail(false);
        dispatch(currentUserAdded(id, name, photo, newEmail, true));
        setNewEmail('');
        setPassword('');
      }
    } catch (err) {
      if (err.code === 'auth/wrong-password') setEditError('Wrong Password');
      else if (err.code === 'auth/email-already-in-use')
        setError('Email already in use');
      else setEditError('Something went wrong');
    }
  };

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      const credential = emailProvider.credential(email, password);
      await user.reauthenticateWithCredential(credential);
      if (!newPassword || !/^.{6,}$/i.test(newPassword)) {
        setEditError('Password must be at least 6 characters');
      } else {
        await user.updatePassword(newPassword);
        setEditError('');
        setEditPassword(false);
        setPassword('');
        setNewPassword('');
      }
    } catch (err) {
      if (err.code === 'auth/wrong-password') setEditError('Wrong Password');
      else setEditError('Something went wrong');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="p-2 md:px-16 xl:px-32 shadow-navbar text-center text-2xl text-gray-dark">
        Profile
      </h1>
      {error && <p className="text-red-700 my-2 text-center">{error}</p>}
      <div className="flex-grow px-4">
        <div className="w-32 h-32 relative rounded-full m-auto mt-16">
          <img
            src={photo}
            className="block w-full h-full rounded-full"
            alt="profile"
          />
          <label
            htmlFor="photo"
            aria-label="select profile picture"
            className="absolute bottom-0 right-0 cursor-pointer"
          >
            {uploading ? (
              <Spinner centered={false} />
            ) : (
              <>
                <input
                  type="file"
                  id="photo"
                  aria-label="change profile picture"
                  className="w-0 h-0 opacity-0"
                  onChange={handleNewPhoto}
                />
                <Camera />
              </>
            )}
          </label>
        </div>
        <p className="text-center mt-2 mb-16">{name}</p>
        <div className="w-full max-w-sm py-4 m-auto">
          {auth.currentUser.providerData[0].providerId === 'password' && (
            <>
              <div className="flex items-center mb-8">
                <Email />
                <p className="flex-grow ml-2 text-gray-dark">{email}</p>
                <button
                  type="button"
                  aria-label="change email"
                  className="self-end"
                  onClick={() => setEditEmail(true)}
                >
                  <Edit />
                </button>
                {editEmail && (
                  <Popup onClick={() => setEditEmail(false)}>
                    <div className="px-4">
                      <div className="h-32 grid content-between mt-12 mb-8">
                        <TextInput
                          placeholder="New Email"
                          label="email"
                          type="text"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
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
                      <Button onClick={handleChangeEmail}>
                        <span>Submit</span>
                      </Button>
                      {editError && (
                        <p className="text-red-700 my-2 text-center">
                          {editError}
                        </p>
                      )}
                    </div>
                  </Popup>
                )}
              </div>
              <div className="flex items-center mb-8">
                <Password />
                <p className="flex-grow ml-2 text-gray-dark">Password</p>
                <button
                  type="button"
                  aria-label="change email"
                  className="self-end"
                  onClick={() => setEditPassword(true)}
                >
                  <Edit />
                </button>
                {editPassword && (
                  <Popup onClick={() => setEditPassword(false)}>
                    <div className="px-4">
                      <div className="h-32 grid content-between mt-12 mb-8">
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
                          placeholder="New Password"
                          label="new password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        >
                          <Password className="absolute left-icon top-icon" />
                        </TextInput>
                      </div>
                      <Button onClick={handleChangePassword}>
                        <span>Submit</span>
                      </Button>
                      {editError && (
                        <p className="text-red-700 my-2 text-center">
                          {editError}
                        </p>
                      )}
                    </div>
                  </Popup>
                )}
              </div>
            </>
          )}
          <button
            type="button"
            className="flex items-center"
            onClick={() => auth.signOut()}
          >
            <ExitIcon />
            <span className="flex-grow ml-2 text-gray-dark">Log Out</span>
          </button>
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default Profile;
