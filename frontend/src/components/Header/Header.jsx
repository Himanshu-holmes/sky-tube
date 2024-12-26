import React, { useState } from "react";
import { Logo } from "../../assets/Logo";
import { Button, SearchBar } from "../index.js";

import {
  CameraIcon,
  FolderClosed,
  HelpCircle,
  History,
  HomeIcon,
  Search,
  Settings,
  ThumbsUpIcon,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutBtn from "./LogoutBtn.jsx";
import { useForm } from "react-hook-form";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const avatar = useSelector((state) => state.auth?.userData?.avatar);
  const username = useSelector((state) => state.auth?.userData?.username);
  const fullName = useSelector((state) => state.auth?.userData?.fullName);

  const [toggleMenu, setToggleMenu] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
  ];

  const navItemSide = [
    {
      name: "Liked Videos",
      icon: <ThumbsUpIcon />,
      slug: "/liked-videos",
    },

    {
      name: " My Content",
      icon: <CameraIcon />,
      slug: "/my-content",
    },

    {
      name: "Support",
      icon: <HelpCircle />,
      slug: "/support",
    },

    {
      name: "Setting",
      icon: <Settings />,
      slug: "/setting",
    },
  ];

  const { register, handleSubmit } = useForm();

  const search = (data) => {
    const query = data?.query;

    navigate(`/search/${query}`);
  };
  return (
    <>
      <div className="h-screenbg-[#121212] text-white">
        <header className="sticky inset-x-0 top-0 z-50 w-full border-b border-white bg-[#121212] px-4">
          <nav className="mx-auto flex max-w-7xl items-center py-2">
            <div
              className="mr-4 w-12 shrink-0 sm:w-16"
              onClick={() => navigate("/")}
            >
              <Logo />
            </div>
            <SearchBar />
            <form
              className="ml-auto sm:hidden flex items-center justify-center"
              onSubmit={handleSubmit(search)}
            >
              <input
                className="w-full border bg-transparent py-1 pl-8 pr-3  outline-none sm:py-2"
                placeholder="Search"
                {...register("query", { required: true })}
              />
            </form>
            <button
              className="group peer ml-4 flex w-6 shrink-0 flex-wrap gap-y-1.5 sm:hidden"
              onClick={() => setToggleMenu((prev) => !prev)}
            >
              <span className="block h-[2px] w-full bg-white group-hover:bg-[#ae7aff]"></span>
              <span className="block h-[2px] w-2/3 bg-white group-hover:bg-[#ae7aff]"></span>
              <span className="block h-[2px] w-full bg-white group-hover:bg-[#ae7aff]"></span>
            </button>
            <div className="fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 translate-x-full flex-col border-l border-white bg-[#121212] duration-200 hover:translate-x-0 peer-focus:translate-x-0 sm:static sm:ml-4 sm:w-auto sm:translate-x-0 sm:border-none">
              {toggleMenu && (
                <div className="relative flex w-full items-center justify-between border-b border-white px-4 py-2 sm:hidden">
                  <span className="inline-block w-12">
                    <Logo />
                  </span>
                  <button
                    className="inline-block w-8"
                    onClick={() => setToggleMenu((prev) => !prev)}
                  >
                    <XCircle />
                  </button>
                </div>
              )}
              <ul className="my-4 flex w-full flex-wrap gap-2 px-4 sm:hidden">
                {navItemSide.map((item) => (
                  <NavLink className="w-full" to={item.slug} key={item.slug}>
                    <button className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-[#ae7aff] hover:text-black focus:border-[#ae7aff] focus:bg-[#ae7aff] focus:text-black">
                      <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </button>
                  </NavLink>
                ))}
              </ul>
              <div className="mb-8 mt-auto flex w-full flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:items-center sm:px-0">
                {navItems.map((item) =>
                  item.active ? (
                    <div key={item.name}>
                      <button
                        onClick={() => navigate(item.slug)}
                        className="mr-1 w-full bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
                      >
                        {item.name}
                      </button>
                    </div>
                  ) : null
                )}
                {authStatus && (
                  <div className="sm:flex sm:gap-5">
                    <div className="mb-8 mt-auto px-4 sm:mb-0 sm:mt-0 sm:px-0">
                      <button
                        className="flex w-full gap-4 text-left sm:items-center"
                        onClick={() => navigate(`/channel/${username}`)}
                      >
                        <img
                          src={avatar}
                          alt={username}
                          className="h-16 w-16 shrink-0 rounded-full sm:h-12 sm:w-12"
                        />
                        <div className="w-full pt-2 sm:hidden">
                          <h6 className="font-semibold">{fullName}</h6>
                          <p className="text-sm text-gray-300">@{username}</p>
                        </div>
                      </button>
                    </div>
                    <LogoutBtn />
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  );
};

export default Header;
