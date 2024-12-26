import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance";

export const toggleSubscription = async ({ channelId }) => {
  try {
    const resposne = await axiosInstance.post(
      `/subscriptions/channel/${channelId}`
    );

    if (resposne.data.data.subscribed === true) {
      toast.success("Subscribed The Channel");
      return resposne.data.data.subscribed;
    } else {
      toast.success("UnSubscribed The Channel 😖");
      return resposne.data.data.subscribed;
    }
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const getChannelSubscribers = async ({ channelId }) => {
  try {
    const resposne = await axiosInstance.get(
      `/subscriptions/channel/${channelId}`
    );
    // data is in form of array

    return resposne.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};

export const getUserChannelSubscription = async ({ subscriberId }) => {
  try {
    const response = await axiosInstance.get(
      `/subscriptions/user/${subscriberId}`
    );
    // data is in form of array
    toast.success("Successfully Fetched The Subscrbed Channel");
    return response.data.data;
  } catch (error) {
    toast.error("Something Went Wrong");
    console.log(error?.response?.data);
  }
};
