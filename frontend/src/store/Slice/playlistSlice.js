import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  allPlaylist: null,
  playlists: [],
  channelPlaylists: [],
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    getAllPlaylistSuccess: (state, action) => {
      state.loading = false;
      state.allPlaylist = [...action.payload];
    },

    getPlaylistSuccess: (state, action) => {
      state.playlists = [...action.payload];
    },

    getPlaylistByUserSuccess: (state, action) => {
      state.channelPlaylists = [...action.payload];
    },
  },
});

export const {
  getAllPlaylistSuccess,
  getPlaylistSuccess,
  getPlaylistByUserSuccess,
} = playlistSlice.actions;

export default playlistSlice.reducer;
