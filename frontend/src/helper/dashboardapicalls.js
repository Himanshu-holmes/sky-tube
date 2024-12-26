import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";

export const getChannelStats = async () => {
  try {
    const response = await axiosInstance.get("/dashboard/stats");
    toast.success("Your Channel Stats Fetched Succcesfully");
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const getChannelVideos = async () => {
  try {
    const response = await axiosInstance.get("/dashboard/videos");
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};
