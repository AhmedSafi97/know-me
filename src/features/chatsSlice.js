/* eslint-disable no-param-reassign */
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import getChats from './getChats';

const chatsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});

const initialState = chatsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchChats = createAsyncThunk(
  'fetch/chats',
  async ({ roomId, user1, user2 }) => {
    const chats = await getChats(roomId, user1, user2);

    return chats;
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    chatAdded: chatsAdapter.addOne,
    chatsRemoved: (state) => {
      state.status = 'idle';
      state.error = null;
      chatsAdapter.removeAll(state);
    },
  },
  extraReducers: {
    [fetchChats.pending]: (state) => {
      state.status = 'pending';
    },
    [fetchChats.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      chatsAdapter.addMany(state, action.payload);
    },
    [fetchChats.rejected]: (state) => {
      state.status = 'failed';
      state.error = 'Something went wrong';
    },
  },
});

export const {
  selectAll: selectAllChats,
  selectById: selectChatById,
  selectIds: selectChatsIds,
} = chatsAdapter.getSelectors((state) => state.chats);

export const { chatAdded, chatsRemoved } = chatsSlice.actions;

export default chatsSlice.reducer;
