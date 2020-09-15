/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    currentUserAdded: {
      reducer: (state, action) => {
        const { id, name, photo, email, profileCompleted } = action.payload;
        state.auth = true;
        state.id = id;
        state.name = name;
        state.photo = photo;
        state.email = email;
        state.profileCompleted = profileCompleted;
      },
      prepare: (id, name, photo, email, profileCompleted) => ({
        payload: { id, name, photo, email, profileCompleted },
      }),
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
