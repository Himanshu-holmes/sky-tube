import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  uploading: false,
  uploaded: false,
  videos: {
    docs: [],
    hasNextPage: false,
  },
  video: null,
  publishToggled: false,
  loading: false,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    getAllVideosSuccess: (state, action) => {
      state.videos.docs = [...action.payload.docs];
      state.videos.hasNextPage = action.payload.hasNextPage;
    },
    getVideoByIdSuccess: (state, action) => {
      state.video = action.payload;
    },

    publishVideoUploading: (state, action) => {
      state.uploading = true;
    },
    publishVideoSuccess: (state, action) => {
      state.uploading = false;
      state.uploaded = true;
    },

    togglePublishedSuccess: (state, action) => {
      state.publishToggled = action.payload;
    },

    updateSuccess: (state, action) => {
      state.uploaded = true;
    },
    updateUploadState: (state) => {
      state.uploading = false;
      state.uploaded = false;
    },
    makeVideosNull: (state) => {
      state.videos.docs = [];
    },
  },
});

export const {
  getAllVideosSuccess,
  getVideoByIdSuccess,
  updateUploadState,
  makeVideosNull,
  togglePublishedSuccess,
  updateSuccess,
  publishVideoSuccess,
  publishVideoUploading,
} = videoSlice.actions;

export default videoSlice.reducer;
