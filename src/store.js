import { configureStore } from '@reduxjs/toolkit';

import currentUserReducer from './features/currentUserSlice';
import contactsReducer from './features/contactsSlice';
import requestsSlice from './features/requestsSlice';
import roomsSlice from './features/roomsSlice';

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
    contacts: contactsReducer,
    requests: requestsSlice,
    rooms: roomsSlice,
  },
});
