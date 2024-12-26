import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { userChannelProfile } from "../../helper/userapicalls";
import { userChannelProfileSuccess } from "../../store/Slice/userSlice";
import { ChannelHeader, ChannelNavigate } from "../../components";

const Channel = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    userChannelProfile({ username })
      .then((data) => {
        dispatch(userChannelProfileSuccess(data));
      })
      .catch((err) => console.log(err));
  }, [dispatch, username]);

  const channel = useSelector((state) => state.user?.profileData);

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            {channel && (
              <ChannelHeader
                coverImage={channel?.coverImage}
                avatar={channel?.avatar}
                username={channel?.username}
                fullName={channel?.fullName}
                subscribersCount={channel?.subscribersCount}
                subscribedCount={channel?.channelsSubscribedToCount}
                isSubscribed={channel?.isSubscribed}
                channelId={channel?._id}
              />
            )}
            <ChannelNavigate username={username} />

            <div>
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Channel;
