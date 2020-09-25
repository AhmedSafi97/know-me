import { configureStore } from '@reduxjs/toolkit';

import currentUserReducer from './features/currentUserSlice';
import contactsReducer from './features/contactsSlice';

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
    contacts: contactsReducer,
  },
});
