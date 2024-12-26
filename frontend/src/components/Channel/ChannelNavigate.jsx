import React from "react";
import { NavLink } from "react-router-dom";

const ChannelNavigate = ({ username, setting }) => {
  if (setting) {
    return (
      <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "w-full border-b-2 border-[#ae7aff] bg-slate-200 px-3 py-1.5 text-[#ae7aff]"
              : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
          }
          to={"/setting/personal"}
        >
          Personal Information
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? "w-full border-b-2 border-[#ae7aff] bg-slate-200 px-3 py-1.5 text-[#ae7aff]"
              : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
          }
          to={"/setting/password"}
        >
          Change Password
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "w-full border-b-2 border-[#ae7aff] bg-slate-200 px-3 py-1.5 text-[#ae7aff]"
              : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
          }
          to={"/setting/avatar"}
        >
          Update Avatar
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? "w-full border-b-2 border-[#ae7aff] bg-slate-200 px-3 py-1.5 text-[#ae7aff]"
              : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
          }
          to={"/setting/coverImage"}
        >
          Update CoverImage
        </NavLink>
      </ul>
    );
  }
  return (
    <>
      <div className="px-4 pb-4">
        <div className="no-scrollbar  top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
          <NavLink
            to={`/channel/${username}/videos`}
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-[#ae7aff] bg-slate-200 px-3 py-1.5 text-[#ae7aff]"
                : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
            }
          >
            Videos
          </NavLink>

          <NavLink
            to={`/channel/${username}/playlist`}
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-[#ae7aff] bg-slate-200  px-3 py-1.5 text-[#ae7aff]"
                : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
            }
          >
            Playlist
          </NavLink>

          <NavLink
            to={`/channel/${username}/tweets`}
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-[#ae7aff] bg-slate-200 px-3 py-1.5 text-[#ae7aff]"
                : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
            }
          >
            Tweets
          </NavLink>

          <NavLink
            to={`/channel/${username}/subscribed`}
            className={({ isActive }) =>
              isActive
                ? "w-full border-b-2 border-[#ae7aff] bg-slate-200 px-3 py-1.5 text-[#ae7aff]"
                : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
            }
          >
            Subscribed
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default ChannelNavigate;
