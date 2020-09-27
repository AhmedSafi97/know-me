/* eslint-disable no-param-reassign */
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import { retrieveLastMessages } from '../utils';

const lastMessagesAdapter = createEntityAdapter();

const initialState = lastMessagesAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchLastMessages = createAsyncThunk(
  'fetch/lastMessages',
  async () => {
    const lastMessages = await retrieveLastMessages();

    return lastMessages.filter((message) => message !== null);
  }
);

const lastMessagesSlice = createSlice({
  name: 'lastMessages',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchLastMessages.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchLastMessages.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      lastMessagesAdapter.setAll(state, action.payload);
    },
    [fetchLastMessages.rejected]: (state) => {
      state.status = 'failed';
      state.error = 'Something went wrong.';
    },
  },
});

export const {
  selectById: selectLastMessageById,
} = lastMessagesAdapter.getSelectors((state) => state.lastMessages);

export default lastMessagesSlice.reducer;
