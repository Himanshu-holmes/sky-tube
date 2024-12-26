import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";

export const getUserWatchHistroy = async () => {
  try {
    const response = await axiosInstance.get("/users/watch-history");

    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const userChannelProfile = async ({ username }) => {
  try {
    const response = await axiosInstance.get(`/users/channel/${username}`);
    toast.success("Channel Details Are Fetched");
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response.data);
  }
};
