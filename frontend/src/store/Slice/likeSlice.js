import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  allLikedVideos: [],
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    getLikedVideosSuccess: (state, action) => {
      state.allLikedVideos = action.payload;
    },
  },
});

export const { getLikedVideosSuccess } = likeSlice.actions;

export default likeSlice.reducer;
