import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectCurrentUser,
  currentUserAdded,
} from '../features/currentUserSlice';
import { auth, db, storage } from '../firebase';
import { Button, Spinner } from '../Components';
import { ReactComponent as FemaleIcon } from '../assets/female.svg';
import { ReactComponent as FemaleIconSelected } from '../assets/female-selected.svg';
import { ReactComponent as MaleIcon } from '../assets/male.svg';
import { ReactComponent as MaleIconSelected } from '../assets/male-selected.svg';
import { ReactComponent as SelectPhoto } from '../assets/select-photo.svg';

const validateForm = (gender, name, age, photo) => {
  if (gender !== 'male' && gender !== 'female')
    return 'Please select your gender';
  if (name.length < 5) return 'Your name should be more than 4 characters';
  if (name.length > 20) return 'Name is too long';
  if (age < 13) return 'You should be over 13 years old to use the app';
  if (!photo) return 'Please select a picture for your profile';
  return null;
};

const CompleteProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [gender, setGender] = useState('');
  const [name, setName] = useState(currentUser.name || '');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState(currentUser.photo || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoUpload = (e) => {
    if (e.target.files) {
      const photoObj = e.target.files[0];
      const photoAddress = currentUser.id;
      const uploadTask = storage
        .ref(`photos/${photoAddress}/${photoObj.name}`)
        .put(photoObj);
      if (photoObj.size > 1000000) {
        setError('Image size is too large');
      } else if (
        photoObj.type !== 'image/png' &&
        photoObj.type !== 'image/jpeg'
      ) {
        setError('Invalid image type');
      } else {
        setError('');
        setUploading(true);
        uploadTask.on(
          'state_changed',
          null,
          () => {
            setError('Something went wrong, please try again later');
            setUploading(false);
          },
          () =>
            storage
              .ref('photos')
              .child(photoAddress)
              .child(photoObj.name)
              .getDownloadURL()
              .then((url) => {
                setPhoto(url);
                setUploading(false);
              })
        );
      }
    }
  };

  const handleProfileCompletion = () => {
    const validationResult = validateForm(gender, name, age, photo);
    if (validationResult === null) {
      setUploading(true);
      db.ref(`/users/${currentUser.id}`)
        .set({
          gender,
          age,
        })
        .then(() =>
          auth.currentUser.updateProfile({
            displayName: name,
            photoURL: photo,
          })
        )
        .then(() =>
          dispatch(
            currentUserAdded(
              currentUser.id,
              name,
              photo,
              currentUser.email,
              true
            )
          )
        )
        .catch(() => {
          setError('Something went wrong, please try again later');
          setUploading(false);
        });
    } else setError(validationResult);
  };

  return (
    <div className="h-screen px-4">
      <div className="w-full max-w-sm mt-6 m-auto">
        <div className="flex w-40 items-center justify-between">
          <span className="text-xl text-gray-medium">Gender</span>
          <label className="cursor-pointer" htmlFor="male">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              className="absolute w-0 h-0 opacity-0"
              onChange={(e) => setGender(e.target.value)}
            />
            {gender === 'male' ? <MaleIconSelected /> : <MaleIcon />}
          </label>
          <label className="cursor-pointer" htmlFor="female">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              className="absolute w-0 h-0 opacity-0"
              onChange={(e) => setGender(e.target.value)}
            />
            {gender === 'female' ? <FemaleIconSelected /> : <FemaleIcon />}
          </label>
        </div>
      </div>
      <div className="grid content-between h-32 w-full max-w-sm mt-16 m-auto">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b-2 border-gray-medium w-full py-2  text-gray-medium text-xl placeholder-gray-medium"
        />
        <input
          type="number"
          placeholder="Age"
          min="13"
          max="99"
          step="1"
          value={age}
          onChange={(e) => setAge(Math.round(e.target.value))}
          className="border-b-2 border-gray-medium w-full py-2  text-gray-medium text-xl placeholder-gray-medium"
        />
      </div>
      <div className="my-8 w-56 m-auto">
        {photo ? (
          <img
            alt="profile"
            src={photo}
            className="rounded-full w-24 h-24 m-auto mb-12"
          />
        ) : (
          <>
            <label
              className="cursor-pointer"
              htmlFor="photo"
              aria-label="select profile picture"
            >
              <input
                type="file"
                id="photo"
                disabled={uploading}
                className="w-0 h-0 opacity-0"
                onChange={handlePhotoUpload}
              />
              <SelectPhoto className="m-auto" />
            </label>
            <p className=" text-gray-medium text-xl text-center mt-3">
              Upload a clear picture
            </p>
          </>
        )}
      </div>
      <Button disabled={uploading} onClick={handleProfileCompletion}>
        {uploading ? <Spinner centered={false} /> : 'START KNOW ME'}
      </Button>
      {error && <p className="text-red-700 my-2 text-center">{error}</p>}
    </div>
  );
};

export default CompleteProfile;
