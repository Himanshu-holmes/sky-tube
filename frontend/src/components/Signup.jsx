import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../assets/Logo.jsx";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button, Input } from "./index.js";
import { getCurrentUser, userSingup } from "../helper/authapicalls.js";
import { login } from "../store/Slice/authSlice.js";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    const userData = await userSingup(data);
    if (userData)
      //  dispatch(login(userData));
      navigate("/login");
    // userSingup(data)
    //   .then((data) => {
    //     dispatch(login(data));
    //     navigate("/login");
    //   })
    //   .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4">
          <div className="mx-auto inline-block w-16">
            <Logo />
          </div>
          {/* <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">
            mytube
          </div> */}
          <h2 className=" mb-6 w-full text-center text-2xl font-semibold leading-tight uppercase">
            Sign up to create account
          </h2>
          <p className="mb-6 text-center text-base ">
            Already have an account ?&nbsp;
            <Link
              to="/login"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSubmit(submit)}>
            <div>
              <Input
                lable="FullName"
                placeholder="Enter your Full Name"
                className="w-full"
                {...register("fullName", {
                  required: "*FullName is required",
                  minLength: 3,
                })}
              />
              {errors.fullName && (
                <span className="text-red-400 font-thin">
                  {errors.fullName.message}
                </span>
              )}

              <Input
                lable="UserName: "
                placeholder="Enter your Username"
                className="w-full"
                {...register("username", {
                  required: "*username is required",
                  minLength: 3,
                })}
              />
              {errors.username && (
                <span className="text-red-400 font-thin">
                  {errors.username.message}
                </span>
              )}
              <Input
                lable="Email"
                placeholder="Enter your Email"
                type="email"
                className="w-full"
                {...register("email", {
                  required: "*Email is required",
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value
                      ) || "Email address must be a valid address",
                  },
                })}
              />

              {errors.email && (
                <span className="text-red-400 font-thin">
                  {errors.email.message}
                </span>
              )}
              <Input
                lable="Password: "
                type="password"
                placeholder="Enter your Password"
                className="w-full"
                {...register("password", {
                  required: "*Password is required",
                  minLength: 5,
                })}
              />
              <div>
                {errors.password && (
                  <span className="text-red-400 font-thin">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <span className="text-center text-sm font-thin">
                Profile Picture
              </span>
              <Input
                lable="Profile Picture"
                type="file"
                placeholder=""
                className="w-full"
                {...register("avatar", {
                  required: "*Profile Picture is required",
                })}
                accept="image/png, image/jpeg"
              />
              <div>
                {errors.avatar && (
                  <span className="text-red-400 font-thin">
                    {errors.avatar.message}
                  </span>
                )}
              </div>

              <span className="text-center text-sm font-thin">
                Channel Banner
              </span>
              <Input
                lable="Cover Image"
                type="file"
                placeholder=""
                className="w-full"
                {...register("coverImage", {
                  required: "*Channel Banner is required",
                })}
                accept="image/png, image/jpeg"
              />
              {errors.coverImage && (
                <span className="text-red-400 font-thin">
                  {errors.coverImage.message}
                </span>
              )}

              <Button type="submit" className="w-full rounded-md">
                Sign up with Email
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
