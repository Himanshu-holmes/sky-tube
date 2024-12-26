import React from "react";
import { Plus } from "lucide-react";

const DashboardHeader = ({ username, setPopUp }) => {
  return (
    <div className="flex flex-wrap justify-between gap-4">
      <div className="block">
        <h1 className="text-2xl font-bold">Welcome Back,{username}</h1>
        <p className="text-sm text-gray-300">
          Seamless Video Management, Elevated Results.
        </p>
      </div>
      <div className="block">
        <button
          className="inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black"
          onClick={() =>
            setPopUp((prev) => ({
              ...prev,
              uploadVideo: !prev.uploadVideo,
            }))
          }
        >
          <Plus width={20} height={20} />
          Upload video
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
