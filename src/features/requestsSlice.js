/* eslint-disable no-param-reassign */
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import retrieveRequestsInfo from './retrieveContactsInfo';

const requestsAdapter = createEntityAdapter();

const initialState = requestsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchRequests = createAsyncThunk('fetch/requests', async () => {
  const requests = await retrieveRequestsInfo();

  return requests.filter((request) => request !== null);
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    requestReceived: requestsAdapter.addOne,
    requestRemoved: requestsAdapter.removeOne,
  },
  extraReducers: {
    [fetchRequests.pending]: (state) => {
      state.status = 'loading';
    },
    [fetchRequests.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      requestsAdapter.setAll(state, action.payload);
    },
    [fetchRequests.rejected]: (state) => {
      state.status = 'failed';
      state.error =
        'Something went wrong, unable to retrieve your friendship requests.';
    },
  },
});

export const {
  selectById: selectRequestById,
  selectIds: selectRequestsIds,
} = requestsAdapter.getSelectors((state) => state.requests);

export const { requestReceived, requestRemoved } = requestsSlice.actions;

export default requestsSlice.reducer;
