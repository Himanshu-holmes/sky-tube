import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slice/authSlice";
import videoSlice from "./Slice/video.slice";
import commentSlice from "./Slice/comment.slice";
import subscribeSlice from "./Slice/subscribeSlice";
import likeSlice from "./Slice/likeSlice";
import playlistSlice from "./Slice/playlistSlice";
import userSlice from "./Slice/userSlice";
import dashboardSlice from "./Slice/dashboardSlice";
import tweetSlice from "./Slice/tweetSlice";
//import logger from "redux-logger";

// const middleWares = [process.env.NODE_ENV !== "production" && logger].filter(
//   Boolean
// );

const store = configureStore({
  reducer: {
    auth: authSlice,
    video: videoSlice,
    comment: commentSlice,
    subscribe: subscribeSlice,
    like: likeSlice,
    playlist: playlistSlice,
    user: userSlice,
    dashboard: dashboardSlice,
    tweet: tweetSlice,
  },
  // middleware: () => middleWares,
});

export default store;
