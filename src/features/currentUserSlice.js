/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    currentUserAdded: {
      reducer: (state, action) => {
        state.auth = true;
        state.id = action.payload.id;
      },
      prepare: (id) => ({ payload: { id } }),
    },
    currentUserRemoved: () => ({
      auth: false,
    }),
  },
});

export const {
  currentUserAdded,
  currentUserRemoved,
} = currentUserSlice.actions;

export const selectCurrentUser = (state) => state.currentUser;

export default currentUserSlice.reducer;
