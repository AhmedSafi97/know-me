/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const requestsAdapter = createEntityAdapter();

const initialState = requestsAdapter.getInitialState();

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    requestReceived: requestsAdapter.addOne,
    requestRemoved: requestsAdapter.removeOne,
  },
});

export const {
  selectById: selectRequestById,
  selectIds: selectRequestsIds,
} = requestsAdapter.getSelectors((state) => state.requests);

export const { requestReceived, requestRemoved } = requestsSlice.actions;

export default requestsSlice.reducer;
