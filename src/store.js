import { configureStore } from '@reduxjs/toolkit';

import currentUserReducer from './features/currentUserSlice';

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
  },
});
