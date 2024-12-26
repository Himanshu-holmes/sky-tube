import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  subscribed: null,
  channelSubscribers: [],
  mySubscriptions: [],
};

const subscribeSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    toggleSubscriptionSuccess: (state, action) => {
      state.loading = false;
      state.subscribed = action.payload;
    },

    getAllUserChannelSubscribersSuccess: (state, action) => {
      state.loading = false;
      state.channelSubscribers = action.payload;
    },

    getAllSubscribedChannelsOfUserSuccess: (state, action) => {
      state.mySubscriptions = action.payload;
    },
  },
});

export const {
  getAllSubscribedChannelsOfUserSuccess,
  toggleSubscriptionSuccess,
  getAllUserChannelSubscribersSuccess,
} = subscribeSlice.actions;

export default subscribeSlice.reducer;
