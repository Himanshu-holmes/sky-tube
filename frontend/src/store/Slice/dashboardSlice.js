import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  channelStats: [],
  channelVideos: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    getChannelStatsSuccess: (state, action) => {
      state.channelStats = action.payload;
    },

    getChannelVideosSuccess: (state, action) => {
      state.channelVideos = action.payload;
    },
  },
});

export const { getChannelStatsSuccess, getChannelVideosSuccess } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
