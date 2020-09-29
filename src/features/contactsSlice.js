/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const contactsAdapter = createEntityAdapter();

const initialState = contactsAdapter.getInitialState();

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    contactAdded: contactsAdapter.addOne,
    contactRemoved: contactsAdapter.removeOne,
  },
});

export const {
  selectById: selectContactById,
  selectIds: selectContactsIds,
} = contactsAdapter.getSelectors((state) => state.contacts);

export const { contactRemoved, contactAdded } = contactsSlice.actions;

export default contactsSlice.reducer;
