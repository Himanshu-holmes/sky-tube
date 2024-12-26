import {
  CameraIcon,
  FolderClosed,
  HelpCircle,
  History,
  HomeIcon,
  Settings,
  ThumbsUpIcon,
  UserRoundCheck,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const username = useSelector((state) => state.auth?.userData?.username);
  const sideItems = [
    {
      name: "Home",
      icon: <HomeIcon />,
      slug: "/",
    },
    {
      name: "Liked Videos",
      icon: <ThumbsUpIcon />,
      slug: "/liked-videos",
    },
    {
      name: "History",
      icon: <History />,
      slug: "/history",
    },
    {
      name: " My Content",
      icon: <CameraIcon />,
      slug: "/my-content",
    },
    {
      name: "Collections",
      icon: <FolderClosed />,
      slug: "/collections",
    },
    {
      name: "Subscriptions",
      icon: <UserRoundCheck />,
      slug: "/subscriptions",
    },
  ];

  const sideBottom = [
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

  const bottomSideItems = [
    {
      name: "Home",
      icon: <HomeIcon />,
      slug: "/",
    },
    {
      name: "History",
      icon: <History />,
      slug: "/history",
    },
    {
      name: "Collections",
      icon: <FolderClosed />,
      slug: "/collections",
    },
    {
      name: "Subscriptions",
      icon: <UserRoundCheck />,
      slug: "/subscriptions",
    },
  ];

  return (
    <>
      <div className="sm:block hidden">
        <div className="text-white lg:w-56 md:w-44 w-16 sm:p-3 p-2 border-white border-r h-screen flex flex-col justify-between">
          <div className="flex flex-col gap-4 mt-5">
            {sideItems.map((item) => (
              <NavLink
                to={item.slug}
                key={item.slug}
                className="hover:bg-[#ae7aff]"
              >
                <div className="flex items-center gap-2 justify-center sm:justify-start hover:bg-purple-500 cursor-pointer py-1 px-2 border  border-white">
                  {item.icon}
                  <span className="text-base hidden md:block">{item.name}</span>
                </div>
              </NavLink>
            ))}
          </div>
          <div className="space-y-4 mb-10">
            {sideBottom.map((item) => (
              <NavLink
                className="flex items-center gap-2 justify-center sm:justify-start hover:bg-purple-500 cursor-pointer py-1 px-2 border  border-white"
                to={item.slug}
                key={item.slug}
              >
                {item.icon}
                <span className="text-base hidden md:block">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* for mobile sidebar is bottom bar*/}
      <div className="border-t-2 text-white h-16 sm:hidden z-20 p-1 w-full flex justify-around fixed bottom-0 bg-[#0E0F0F]">
        {bottomSideItems.map((item) => (
          <NavLink
            to={item.slug}
            key={item.slug}
            className="hover:bg-[#ae7aff]"
          >
            <div className="flex flex-col items-center gap-1 cursor-pointer p-1">
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
