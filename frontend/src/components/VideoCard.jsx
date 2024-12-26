import React from "react";
import { useNavigate } from "react-router-dom";
import { calculateTimeAgo, formatDuration } from "../../constants";

const VideoCard = ({
  thumbnail,
  title,
  duration,
  views = 0,
  channelName,
  channelAvatar,
  createdAt,
  videoId,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full">
        <div className="relative mb-2 w-full pt-[56%]">
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
        <div className="flex gap-x-2">
          <div
            className="h-10 w-10 shrink-0"
            onClick={() => navigate(`/channel/${channelName}`)}
          >
            <img
              src={channelAvatar}
              alt={channelName}
              className="h-full w-full rounded-full"
            />
          </div>
          <div className="w-full">
            <h6 className="mb-1 font-semibold">{title}</h6>
            <p className="flex text-sm text-gray-200">
              {views} Views · {calculateTimeAgo(createdAt)}
            </p>
            <p className="text-sm text-gray-200">{channelName}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCard;
