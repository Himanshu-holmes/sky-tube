import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../assets/Logo";
import { useForm } from "react-hook-form";
import { Input, Button } from "./index.js";
import { userLogin } from "../helper/authapicalls";
import { login as authLogin, login } from "../store/Slice/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    const loginData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    const response = await userLogin(loginData);
    if (response) {
      dispatch(login(response));
      toast.success("User Login Succesfully");
    }
    navigate("/");
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
            Sing in to your account
          </h2>
          <p className="mb-6 text-center text-base ">
            Don't have an account ?&nbsp;
            <Link
              to="/signup"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <form onSubmit={handleSubmit(submit)}>
            <div>
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
              {errors.password && (
                <span className="text-red-400 font-thin">
                  {errors.password.message}
                </span>
              )}

              <Button type="submit" className="w-full rounded-md">
                Sing In with Email
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
