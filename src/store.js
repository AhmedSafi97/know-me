import { configureStore } from '@reduxjs/toolkit';

import currentUserReducer from './features/currentUserSlice';
import contactsReducer from './features/contactsSlice';
import requestsSlice from './features/requestsSlice';

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
    contacts: contactsReducer,
    requests: requestsSlice,
  },
});
