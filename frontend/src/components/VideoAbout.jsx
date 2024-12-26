import { FolderPlus, ThumbsDown, ThumbsUp, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Like from "./Like";
import { toggleSubscription } from "../helper/subscriptionapicall";
import { toggleSubscriptionSuccess } from "../store/Slice/subscribeSlice";
import AddToPlaylist from "./AddToPlaylist";
import { calculateTimeAgo } from "../../constants";
import { useNavigate } from "react-router-dom";

const VideoAbout = ({
  avatar,
  channelName,
  createdAt,
  description,
  isSubscribed,
  isLiked,
  likeCount,
  subscribersCount,
  title,
  views,
  videoId,
  channelId,
}) => {
  const currentVideo = useSelector((state) => state.video?.video);
  const dispatch = useDispatch();
  const [isUserSubscribed, setIsUserSubscribed] = useState(isSubscribed);

  const [totalSubscriber, setTotalSubscriber] = useState(subscribersCount);

  const handleSubscribe = (e) => {
    e.preventDefault();
    toggleSubscription({ channelId })
      .then((data) => {
        dispatch(toggleSubscriptionSuccess(data));

        setIsUserSubscribed(!isUserSubscribed);
        if (isUserSubscribed) {
          setTotalSubscriber((prev) => prev - 1);
        } else {
          setTotalSubscriber((prev) => prev + 1);
        }
      })
      .catch((err) => console.log(err));
  };

  const navigate = useNavigate();

  return (
    <>
      {currentVideo && currentVideo.length > 0 ? (
        <div
          className="group mb-4 w-full rounded-lg border p-4 duration-200 hover:bg-white/5 focus:bg-white/5"
          role="button"
          tabIndex="0"
        >
          <div className="flex flex-wrap gap-y-2">
            <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
              <h1 className="text-lg font-bold">{title}</h1>
              <p className="flex text-sm text-gray-200">
                {views} Views {calculateTimeAgo(createdAt)}
              </p>
            </div>
            <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
              <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                <Like
                  isLiked={isLiked}
                  videoId={videoId}
                  likeCount={likeCount}
                />
                <AddToPlaylist videoId={videoId} />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <div className="mt-2 h-12 w-12 shrink-0">
                <img
                  src={avatar}
                  alt="Channel-Avatar"
                  className="h-full w-full rounded-full"
                  onClick={() => navigate(`/channel/${channelName}`)}
                />
              </div>
              <div className="block">
                <p
                  className="text-gray-200"
                  onClick={() => navigate(`/channel/${channelName}`)}
                >
                  {channelName}
                </p>
                <p className="text-sm text-gray-400">
                  {totalSubscriber} Subscribers
                </p>
              </div>
            </div>
            <div className="block">
              {/* TODO:SUBSCRIBED API AND FUNCTINALITY LEFT */}
              <button
                className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
                onClick={handleSubscribe}
              >
                {isUserSubscribed ? (
                  <span> Subscribed</span>
                ) : (
                  <span>Subscribe</span>
                )}

                {/* {isUserSubscribed ? (
                  <span className="hidden group-focus/btn:block">
                    Subscribed
                  </span>
                ) : (
                  <span className="group-focus/btn:hidden">Subscribe</span>
                )} */}
              </button>
            </div>
          </div>
          <hr className="my-4 border-white" />
          <div className="h-5 overflow-hidden group-focus:h-auto">
            <p className="text-sm">{description}</p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default VideoAbout;
