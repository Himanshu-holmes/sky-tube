import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";

export const toggleVideoLike = async ({ videoId }) => {
  try {
    const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
    if (response.data.data.isLiked === true) {
      toast.success("Liked The Video 😀");
      return response.data.data.isLiked;
    } else {
      toast.success("UnLiked The Video 😞");
      return response.data.data.isLiked;
    }
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const toggleCommentLike = async ({ commentId }) => {
  try {
    const response = await axiosInstance.post(`/likes/toggle/c/${commentId}`);
    if (response.data.data.isLiked == true) {
      toast.success("Liked The Comment 😀");
      return response.data.data.isLiked;
    } else {
      toast.success("UnLiked The Comment");
      return response.data.data.isLiked;
    }
  } catch (error) {
    toast.error("Something Went Wrong");

    console.log(error?.response?.data);
  }
};

export const toggleTweetLike = async ({ tweetId }) => {
  try {
    const response = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
    if (response.data.data.isLiked == true) {
      toast.success("Liked The Tweet 😀");
      return response.data.data.isLiked;
    } else {
      toast.success("UnLiked The Tweet");
      return response.data.data.isLiked;
    }
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const getLikedVideos = async () => {
  try {
    const response = await axiosInstance.get("/likes/videos");
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};
