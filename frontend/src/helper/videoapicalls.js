import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance.js";
import { BASE_URL } from "../../constants.js";

export const getAllVideos = async ({
  page = 1,
  limit = 10,
  query,
  sortBy,
  sortType,
  userId,
}) => {
  try {
    const url = new URL(`${BASE_URL}/videos`);

    if (userId) {
      url.searchParams.set("userId", userId);
    }
    if (query) {
      url.searchParams.set("query", query);
    }
    if (sortBy && sortType) {
      url.searchParams.set("sortBy", sortBy);
      url.searchParams.set("sortType", sortType);
    }
    if (page) {
      url.searchParams.set("page", page);
    }
    if (limit) {
      url.searchParams.set("limit", limit);
    }

    const response = await axiosInstance.get(url);
    return response.data.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const getVideoById = async ({ videoId }) => {
  try {
    const resposne = await axiosInstance.get(`/videos/${videoId}`);

    toast.success(resposne?.data?.message);
    return resposne.data.data;
  } catch (error) {
    toast.error("No Video Found By This Id");
    throw error;
  }
};

export const publishAVideo = async (data) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", data.videoFile[0]);
    formData.append("thumbnail", data.thumbnail[0]);

    const response = await axiosInstance.post(
      "/videos/publish-video",
      formData
    );
    toast.success("Your Video has Been Published 👏");
    return response.data.data;
  } catch (error) {
    toast.error("Some thing wen wrong");
    throw error;
  }
};

export const updateVideo = async ({ data, videoId }) => {
  try {
    console.log("data " + data);
    console.log("id " + videoId);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail[0]);

    const response = await axiosInstance.patch(`/videos/${videoId}`, formData);

    toast.success("Updated The Video Details 😃");
    return response.data.data;
  } catch (error) {
    toast.error("Some thing wen wrong");
    console.log(error);
  }
};

export const deleteAVideo = async ({ videoId }) => {
  try {
    console.log(videoId);
    const response = await axiosInstance.delete(`/videos/${videoId}`);
    toast.success("Deleted The Video 😥");
    return response.data.data;
  } catch (error) {
    toast.error("Something wen wrong");
    console.log(error?.response?.data);
  }
};

export const togglePublishStatus = async ({ videoId }) => {
  try {
    const response = await axiosInstance.patch(
      `/videos/toggle/publish/${videoId}`
    );
    if (response.data.data.isPublished != true) {
      toast.success("UnPublished The Video 😞");
      return response.data.data;
    }
    toast.success("Published The Video 😃");
    return response.data.data;
  } catch (error) {
    toast.error("Something wen wrong");
    console.log(error?.response?.data);
  }
};
