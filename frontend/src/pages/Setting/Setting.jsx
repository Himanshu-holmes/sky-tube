import React from "react";
import { useSelector } from "react-redux";
import { ChannelHeader, ChannelNavigate } from "../../components";
import { Outlet, useNavigate } from "react-router-dom";

const Setting = () => {
  const channel = useSelector((state) => state.auth?.userData);
  const navigate = useNavigate();

  return (
    <div>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-4 pb-4 pt-6 md:justify-between">
              <ChannelHeader
                fullName={channel?.fullName}
                username={channel?.username}
                avatar={channel?.avatar}
                channelId={channel?._id}
                coverImage={channel?.coverImage}
                setting={true}
              />
              <div className="">
                <button
                  className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
                  onClick={() => navigate(`/channel/${channel?.username}`)}
                >
                  View channel
                </button>
              </div>
            </div>
            <ChannelNavigate setting={true} />

            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Setting;
