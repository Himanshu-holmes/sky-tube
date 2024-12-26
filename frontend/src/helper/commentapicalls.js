import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";
import { BASE_URL } from "../../constants";
import { comment } from "postcss";

export const getVideoComments = async ({ videoId, page, limit }) => {
  const url = new URL(`${BASE_URL}/comments/${videoId}`);
  if (page) {
    url.searchParams.set("page", page);
  }
  if (limit) {
    url.searchParams.set("limit", limit);
  }

  try {
    const resposne = await axiosInstance.get(url);
    return resposne.data.data;
  } catch (error) {
    toast("No Comments Found For The Video");
    console.log(error?.response?.data);
  }
};

export const addComment = async ({ videoId, content }) => {
  try {
    const resposne = await axiosInstance.post(`/comments/${videoId}`, {
      content,
    });
    toast.success("Comment Added Succesfuly ");
    return resposne.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const editComment = async ({ commentId, content }) => {
  try {
    const resposne = await axiosInstance.patch(
      `/comments/channel/${commentId}`,
      { content }
    );

    return resposne.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const deleteComment = async ({ commentId }) => {
  try {
    const response = await axiosInstance.delete(
      `/comments/channel/${commentId}`
    );
    // message have succesfully
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};
