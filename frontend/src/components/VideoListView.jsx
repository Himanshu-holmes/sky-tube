import React from "react";
import { useNavigate } from "react-router-dom";
import { calculateTimeAgo, formatDuration } from "../../constants";

const VideoListView = ({
  thumbnail,
  title,
  description,
  createdAt,
  videoId,
  channelName,
  channelAvatar,
  duration,
  views,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="w-full max-w-3xl gap-x-4 md:flex">
        <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
          <div className="w-full pt-[56%]">
            <div
              className="absolute inset-0"
              onClick={() => navigate(`/watch/${videoId}`)}
            >
              <img
                src={thumbnail}
                alt={title}
                className="h-full w-full rounded-md"
              />
            </div>
            <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
              {formatDuration(duration)}
            </span>
          </div>
        </div>
        <div className="flex gap-x-2 md:w-7/12">
          <div
            className="h-10 w-10 shrink-0 md:hidden"
            onClick={() => navigate(`/channel/${channelName}`)}
          >
            <img
              src={channelAvatar}
              alt={channelName}
              className="h-full w-full rounded-full"
            />
          </div>
          <div className="w-full">
            <h6 className="mb-1 font-semibold md:max-w-[75%]">{title}</h6>
            <p className="flex text-sm text-gray-200 sm:mt-3">
              {views} Views · {calculateTimeAgo(createdAt)}
            </p>
            <div className="flex items-center gap-x-4">
              <div
                className="mt-2 hidden h-10 w-10 shrink-0 md:block"
                onClick={() => navigate(`/channel/${channelName}`)}
              >
                <img
                  src={channelAvatar}
                  alt={channelName}
                  className="h-full w-full rounded-full"
                />
              </div>
              <p className="text-sm text-gray-200">{channelName}</p>
            </div>
            <p className="mt-2 hidden text-sm md:block">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoListView;
