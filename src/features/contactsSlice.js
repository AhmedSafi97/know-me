/* eslint-disable no-param-reassign */
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import retrieveContactsInfo from './retrieveContactsInfo';

const contactsAdapter = createEntityAdapter();

const initialState = contactsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchContacts = createAsyncThunk('fetch/contacts', async () => {
  const contacts = await retrieveContactsInfo();

  return contacts.filter((contact) => contact !== null);
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    contactAdded: contactsAdapter.addOne,
    contactRemoved: contactsAdapter.removeOne,
  },
  extraReducers: {
    [fetchContacts.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchContacts.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      contactsAdapter.setAll(state, action.payload);
    },
    [fetchContacts.rejected]: (state, v) => {
      state.status = 'failed';
      state.error = 'Something went wrong, unable to retrieve your contacts.';
    },
  },
});

export const {
  selectById: selectContactById,
  selectIds: selectContactsIds,
} = contactsAdapter.getSelectors((state) => state.contacts);

export const { contactRemoved, contactAdded } = contactsSlice.actions;

export default contactsSlice.reducer;
