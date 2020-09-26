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
  ContactsList,
  RequestsList,
} from '../Components';
import { ReactComponent as NewUser } from '../assets/new-user.svg';
import { ReactComponent as Email } from '../assets/email-dark.svg';
import { ReactComponent as FriendshipRequests } from '../assets/requests.svg';

const Contacts = () => {
  const history = useHistory();

  const [friendshipRequests, setFriendshipRequests] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState({});
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setSearchLoading(true);
    setError('');
    const findUser = functions.httpsCallable('findUser');

    try {
      const user = await findUser({ email });
      if (user.data.result === 'not found') {
        setSearchResult('not found');
      } else {
        const { uid, displayName, photoURL } = user.data;
        setSearchResult({ uid, displayName, photoURL });

        // check if the contact already a friend or
        // a request has been sent to this contact or
        // a request has been received from this contact
        const contact = await db
          .ref(`users/${auth.currentUser.uid}/contacts/${uid}`)
          .once('value')
          .then((snapshot) => snapshot.val());
        const requestSent = await db
          .ref(`users/${auth.currentUser.uid}/sent_requests/${uid}`)
          .once('value')
          .then((snapshot) => snapshot.val());
        const requestReceived = await db
          .ref(`users/${auth.currentUser.uid}/received_requests/${uid}`)
          .once('value')
          .then((snapshot) => snapshot.val());

        if (contact || requestSent || requestReceived) {
          setSearchResult((state) => ({
            ...state,
            isNew: false,
          }));
        } else {
          setSearchResult((state) => ({
            ...state,
            isNew: true,
          }));
        }
      }
    } catch (err) {
      setSearchResult('not found');
    }
    setSearchLoading(false);
  };

  const handleAddingNewContact = async (contactId) => {
    try {
      await db.ref(`users/${auth.currentUser.uid}/sent_requests`).update({
        [contactId]: true,
      });

      const sendFriendRequest = functions.httpsCallable('sendFriendRequest');
      const result = await sendFriendRequest({ id: contactId });
      if (result.data.error) setError('Something went wrong');
    } catch (err) {
      setError('Something went wrong');
    }
  };

  let ContactAction = <></>;
  let SearchResult = <></>;

  if (searchResult) {
    // decide what action to take against the contact from the search result
    if (searchResult.isNew) {
      ContactAction = (
        <>
          <AddUser onClick={() => handleAddingNewContact(searchResult.uid)} />
          {error && <p className="text-red-700 my-2 text-center">{error}</p>}
        </>
      );
    }

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
          {ContactAction}
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
            <Popup
              onClick={() => {
                setNewUser(false);
                setSearchResult({});
                setEmail('');
                setError('');
              }}
            >
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
        <div className="mt-4">
          <button type="button" onClick={() => setFriendshipRequests(true)}>
            <FriendshipRequests className="inline mr-2" />
            Friendship Requests
          </button>
          {friendshipRequests && (
            <Popup onClick={() => setFriendshipRequests(false)}>
              <div>
                <RequestsList />
              </div>
            </Popup>
          )}
        </div>
        <ContactsList />
      </div>
      <NavBar />
    </div>
  );
};

export default Contacts;
