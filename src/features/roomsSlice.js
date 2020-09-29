/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const roomsAdapter = createEntityAdapter();

const initialState = roomsAdapter.getInitialState();

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    roomUpdated: roomsAdapter.updateOne,
    roomAdded: roomsAdapter.addOne,
    roomRemoved: roomsAdapter.removeOne,
  },
});

export const { roomUpdated, roomAdded, roomRemoved } = roomsSlice.actions;

export const { selectById: selectRoomById } = roomsAdapter.getSelectors(
  (state) => state.rooms
);

export default roomsSlice.reducer;
