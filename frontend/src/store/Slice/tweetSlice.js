import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  tweets: [],
};

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {
    getUserTweetSuccess: (state, action) => {
      state.loading = false;
      state.tweets = action.payload;
    },

    creatUserTweet: (state, action) => {
      state.tweets.unshift(action.payload);
    },

    deleteTweetSuccess: (state, action) => {
      state.tweets = state.tweets.filter(
        (tweet) => tweet._id !== action.payload
      );
    },
  },
});

export const { getUserTweetSuccess, creatUserTweet, deleteTweetSuccess } =
  tweetSlice.actions;

export default tweetSlice.reducer;
