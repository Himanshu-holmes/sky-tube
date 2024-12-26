import toast from "react-hot-toast";
import axiosInstance from "./axios/axiosInstance.js";
import { useNavigate } from "react-router-dom";

export const userSingup = async (data) => {
  const formData = new FormData();
  formData.append("avatar", data.avatar[0]);
  formData.append("coverImage", data.coverImage[0]);
  formData.append("fullName", data.fullName);
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);

  try {
    const response = await axiosInstance.post("/users/register", formData);
    toast.success("Registerd User Successfully");

    return response.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    toast.error("Refresh Once");
    throw error;
  }
};

export const userLogin = async (data) => {
  try {
    const resposne = await axiosInstance.post("/users/login", data);
    return resposne.data.data.user;
  } catch (error) {
    // toast.error("Something Went Wrong Please Try Again");
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const userLogout = async () => {
  try {
    const response = await axiosInstance.post("/users/logout");
    toast.success("Succesfully Logout");
    return response.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/users/refresh-Token", data);
    return response.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const resposne = await axiosInstance.post("/users/change-Password", data);
    toast.success("Succesfully Update The Password");
    return resposne.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/users/getCurrentUser");
    return response.data.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const updateAvatar = async (data) => {
  try {
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);
    const resposne = await axiosInstance.patch(
      "/users/update-avatar",
      formData
    );

    toast.success("Updated Your Avatar Please Refresh Once");
    return resposne.data.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const updateCoverImage = async (data) => {
  try {
    const formData = new FormData();
    formData.append("coverImage", data.coverImage[0]);

    const resposne = await axiosInstance.patch(
      "/users/update-coverImage",
      formData
    );

    toast.success(
      "Updated Your Channel Banner || Cover Image Please Refresh Once"
    );
    return resposne.data.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};

export const updateUserDetails = async (data) => {
  try {
    const resposne = await axiosInstance.patch("/users/update-account", data);
    toast.success("Updated Your Details Please Refresh Once");
    return resposne.data.data;
  } catch (error) {
    toast.error(error?.response.data.message);
    throw error;
  }
};
