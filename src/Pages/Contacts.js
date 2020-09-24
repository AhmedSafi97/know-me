import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { functions, db, auth } from '../firebase';
import {
  NavBar,
  Exist,
  Popup,
  TextInput,
  Button,
  Spinner,
  AddUser,
} from '../Components';
import { ReactComponent as NewUser } from '../assets/new-user.svg';
import { ReactComponent as Email } from '../assets/email-dark.svg';

const Contacts = () => {
  const history = useHistory();

  const [newUser, setNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setSearchLoading(true);
    const findUser = functions.httpsCallable('findUser');

    try {
      const user = await findUser({ email });
      if (user.data.result === 'not found') {
        setSearchResult('not found');
      } else {
        const { uid, displayName, photoURL } = user.data;
        db.ref(`users/${auth.currentUser.uid}/contacts/${uid}`).on(
          'value',
          (snapshot) => {
            const contact = snapshot.val();
            if (contact === null) {
              setSearchResult({
                uid,
                displayName,
                photoURL,
                isNewContact: true,
              });
            } else {
              setSearchResult({
                uid,
                displayName,
                photoURL,
                isNewContact: false,
              });
            }
          }
        );
      }
    } catch (err) {
      setSearchResult('not found');
    }
    setSearchLoading(false);
  };

  const handleAddingNewContact = async (contactId) => {
    try {
      await db.ref(`users/${auth.currentUser.uid}/contacts`).set({
        [contactId]: false,
      });

      const sendFriendRequest = functions.httpsCallable('sendFriendRequest');
      const result = await sendFriendRequest({ id: contactId });
      if (result.error) setError('Something went wrong');
    } catch (err) {
      setError('Something went wrong');
    }
  };

  let NewContactAction = <></>;
  let SearchResult = <></>;

  if (searchResult) {
    if (searchResult.isNewContact)
      NewContactAction = (
        <>
          <AddUser onClick={() => handleAddingNewContact(searchResult.uid)} />
          {error && <p className="text-red-700 my-2 text-center">{error}</p>}
        </>
      );
    SearchResult =
      searchResult === 'not found' ? (
        <p className="text-center mt-4">{searchResult}</p>
      ) : (
        <div className="flex items-center mt-4">
          <img
            src={searchResult.photoURL}
            className="block w-12 h-12 rounded-full"
            alt={searchResult.displayName}
          />
          <p className="ml-2 flex-grow">{searchResult.displayName}</p>
          {NewContactAction}
        </div>
      );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="p-2 md:px-16 xl:px-32 shadow-navbar text-center text-2xl text-gray-dark flex">
        <Exist onClick={() => history.push('/chats')} />
        <h1 className="flex-grow-2">Contacts</h1>
      </header>
      <div className="p-4 md:px-16 xl:px-32 flex-grow text-gray-dark">
        <div>
          <button type="button" onClick={() => setNewUser(true)}>
            <NewUser className="inline mr-2" />
            New Contact
          </button>
          {newUser && (
            <Popup onClick={() => setNewUser(false)}>
              <div>
                <div className="h-32 grid justify-between">
                  <TextInput
                    placeholder="Contact Email"
                    label="contact email"
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  >
                    <Email className="absolute left-icon top-icon" />
                  </TextInput>
                  {searchLoading ? (
                    <Spinner centered={false} />
                  ) : (
                    <Button onClick={handleSearch}>Find Contact</Button>
                  )}
                </div>
                <div>{SearchResult}</div>
              </div>
            </Popup>
          )}
        </div>
      </div>
      <NavBar />
    </div>
  );
};
export default Contacts;
