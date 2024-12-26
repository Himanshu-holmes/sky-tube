import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  profileData: null,
  watchHistory: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getWatchHistroySuccess: (state, action) => {
      state.loading = false;
      state.watchHistory = action.payload;
    },

    userChannelProfileSuccess: (state, action) => {
      state.loading = false;
      state.profileData = action.payload;
    },
  },
});

export const { getWatchHistroySuccess, userChannelProfileSuccess } =
  userSlice.actions;

export default userSlice.reducer;
