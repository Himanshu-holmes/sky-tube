import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  comments: [],
  totalComments: null,
  hasNextPage: false,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    getAllVideoCommentsSucesss: (state, action) => {
      state.comments = [...action.payload.docs];
      state.totalComments = action.payload.totalDocs;
      state.hasNextPage = action.payload.hasNextPage;
    },

    createACommnetSuccess: (state, action) => {
      state.comments.unshift(action.payload);
      state.totalComments;
    },

    deleteACommnetSuccess: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload.commentId
      );
      state.totalComments -= state.totalComments;
    },

    cleanUpComments: (state, action) => {
      state.comments = [];
    },
  },
});

export const {
  getAllVideoCommentsSucesss,
  createACommnetSuccess,
  deleteACommnetSuccess,
  cleanUpComments,
} = commentSlice.actions;

export default commentSlice.reducer;
