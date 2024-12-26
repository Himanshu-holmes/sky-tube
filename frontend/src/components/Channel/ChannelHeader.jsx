import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSubscription } from "../../helper/subscriptionapicall";
import { toggleSubscriptionSuccess } from "../../store/Slice/subscribeSlice";
const ChannelHeader = ({
  coverImage,
  avatar,
  username,
  fullName,
  subscribersCount = 0,
  subscribedCount = 0,
  isSubscribed = false,
  channelId,
  setting = false,
}) => {
  const [localIsSubscribed, setLocalIsSubscribed] = useState(isSubscribed);
  const [localSubscribersCount, setLocalSubscribersCount] =
    useState(subscribersCount);
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user?.profileData?._id);
  const user = useSelector((state) => state?.auth?.userData?._id);

  useEffect(() => {
    setLocalSubscribersCount(subscribersCount);
    setLocalIsSubscribed(isSubscribed);
  }, [subscribedCount, isSubscribed]);

  const handleSubscribe = () => {
    toggleSubscription({ channelId })
      .then((data) => {
        dispatch(toggleSubscriptionSuccess(data));
        setLocalIsSubscribed((prev) => !prev);
        if (localIsSubscribed) {
          setLocalSubscribersCount((prev) => prev - 1);
        } else {
          setLocalSubscribersCount((prev) => prev + 1);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={coverImage}
            alt="cover-photo"
            className="sm:h-40 h-28 w-full object-cover"
          />
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
            <img src={avatar} alt="Channel" className="h-full w-full" />
          </span>

          <div className="mr-auto inline-block">
            <h1 className="font-bolg text-xl">{fullName}</h1>
            <p className="text-sm text-gray-400">@{username}</p>
            {setting === false && (
              <p className="text-sm text-gray-400">
                {localSubscribersCount && localSubscribersCount} Subscribers · 
                {subscribedCount && subscribedCount}
                Subscribed
              </p>
            )}
          </div>

          {user != userProfile && (
            <div className="inline-block">
              <div className="inline-flex min-w-[145px] justify-end">
                <button
                  className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
                  onClick={handleSubscribe}
                >
                  {localIsSubscribed ? (
                    <span> Subscribed</span>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChannelHeader;
